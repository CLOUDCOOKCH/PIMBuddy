<#
.SYNOPSIS
    PIMBuddy Role Management Module
.DESCRIPTION
    Functions for managing Entra ID directory roles and PIM role assignments
#>

#region Role Definitions

function Get-EntraRoles {
    <#
    .SYNOPSIS
        Get all Entra ID role definitions
    .PARAMETER Filter
        Optional filter string for role name
    .PARAMETER BuiltInOnly
        Only return built-in roles
    #>
    [CmdletBinding()]
    param(
        [string]$Filter = "",

        [switch]$BuiltInOnly
    )

    try {
        Write-PIMBuddyLog -Message "Fetching Entra ID roles..." -Level "Debug"

        $roles = Get-MgRoleManagementDirectoryRoleDefinition -All

        # Apply filters
        if ($BuiltInOnly) {
            $roles = $roles | Where-Object { $_.IsBuiltIn }
        }

        if ($Filter) {
            $roles = $roles | Where-Object { $_.DisplayName -like "*$Filter*" }
        }

        $result = $roles | ForEach-Object {
            [PSCustomObject]@{
                Id = $_.Id
                DisplayName = $_.DisplayName
                Description = $_.Description
                IsBuiltIn = $_.IsBuiltIn
                IsEnabled = $_.IsEnabled
                TemplateId = $_.TemplateId
                Permissions = $_.RolePermissions.AllowedResourceActions
            }
        } | Sort-Object DisplayName

        Write-PIMBuddyLog -Message "Found $($result.Count) roles" -Level "Info"

        return @{
            Success = $true
            Roles = $result
            Count = $result.Count
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to fetch roles" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Roles = @()
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Get-EntraRoleDetails {
    <#
    .SYNOPSIS
        Get detailed information about a specific Entra ID role
    .PARAMETER RoleId
        The ID of the role definition
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$RoleId
    )

    try {
        Write-PIMBuddyLog -Message "Fetching role details: $RoleId" -Level "Debug"

        $role = Get-MgRoleManagementDirectoryRoleDefinition -UnifiedRoleDefinitionId $RoleId

        # Get current role assignments
        $assignments = Get-MgRoleManagementDirectoryRoleAssignment -Filter "roleDefinitionId eq '$RoleId'" -All

        $assignmentDetails = @()
        foreach ($assignment in $assignments) {
            try {
                $principal = $null
                # Try to get as user first
                $principal = Get-MgUser -UserId $assignment.PrincipalId -Property "Id,DisplayName,UserPrincipalName" -ErrorAction SilentlyContinue
                if (-not $principal) {
                    # Try as group
                    $principal = Get-MgGroup -GroupId $assignment.PrincipalId -Property "Id,DisplayName" -ErrorAction SilentlyContinue
                }
                if (-not $principal) {
                    # Try as service principal
                    $principal = Get-MgServicePrincipal -ServicePrincipalId $assignment.PrincipalId -Property "Id,DisplayName" -ErrorAction SilentlyContinue
                }

                $assignmentDetails += [PSCustomObject]@{
                    Id = $assignment.Id
                    PrincipalId = $assignment.PrincipalId
                    PrincipalName = if ($principal) { $principal.DisplayName } else { $assignment.PrincipalId }
                    PrincipalType = if ($principal.UserPrincipalName) { "User" } elseif ($principal.GroupTypes) { "Group" } else { "ServicePrincipal" }
                    DirectoryScopeId = $assignment.DirectoryScopeId
                }
            }
            catch {
                $assignmentDetails += [PSCustomObject]@{
                    Id = $assignment.Id
                    PrincipalId = $assignment.PrincipalId
                    PrincipalName = $assignment.PrincipalId
                    PrincipalType = "Unknown"
                    DirectoryScopeId = $assignment.DirectoryScopeId
                }
            }
        }

        # Get eligible assignments
        $eligibleAssignments = @()
        try {
            $eligible = Get-MgRoleManagementDirectoryRoleEligibilitySchedule -Filter "roleDefinitionId eq '$RoleId'" -All
            foreach ($elig in $eligible) {
                $principal = Get-MgUser -UserId $elig.PrincipalId -Property "DisplayName" -ErrorAction SilentlyContinue
                $eligibleAssignments += [PSCustomObject]@{
                    Id = $elig.Id
                    PrincipalId = $elig.PrincipalId
                    PrincipalName = if ($principal) { $principal.DisplayName } else { $elig.PrincipalId }
                    StartDateTime = $elig.ScheduleInfo.StartDateTime
                    EndDateTime = $elig.ScheduleInfo.Expiration.EndDateTime
                    Status = $elig.Status
                }
            }
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to get eligible assignments for role" -Level "Warning"
        }

        return @{
            Success = $true
            Role = [PSCustomObject]@{
                Id = $role.Id
                DisplayName = $role.DisplayName
                Description = $role.Description
                IsBuiltIn = $role.IsBuiltIn
                IsEnabled = $role.IsEnabled
            }
            ActiveAssignments = $assignmentDetails
            EligibleAssignments = $eligibleAssignments
            TotalActiveCount = $assignmentDetails.Count
            TotalEligibleCount = $eligibleAssignments.Count
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get role details" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Role Assignments

function Add-GroupToEntraRole {
    <#
    .SYNOPSIS
        Assign a PIM group to an Entra ID role (eligible assignment)
    .PARAMETER GroupId
        The ID of the group to assign
    .PARAMETER RoleDefinitionId
        The ID of the role definition
    .PARAMETER AssignmentType
        Whether to create an eligible or active assignment
    .PARAMETER StartDateTime
        When the assignment starts
    .PARAMETER EndDateTime
        When the assignment ends (optional for time-bound)
    .PARAMETER Justification
        Justification for the assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$RoleDefinitionId,

        [ValidateSet("eligible", "active")]
        [string]$AssignmentType = "eligible",

        [datetime]$StartDateTime = (Get-Date),

        [datetime]$EndDateTime,

        [string]$Justification = "Assigned via PIMBuddy"
    )

    try {
        Write-PIMBuddyLog -Message "Adding group $GroupId to role $RoleDefinitionId ($AssignmentType)" -Level "Info"

        # Verify group is role-assignable
        $group = Get-MgGroup -GroupId $GroupId -Property "IsAssignableToRole"
        if (-not $group.IsAssignableToRole) {
            return @{
                Success = $false
                Error = "Group is not role-assignable. Enable IsAssignableToRole before assigning to roles."
            }
        }

        if ($PSCmdlet.ShouldProcess($GroupId, "Add $AssignmentType assignment to role $RoleDefinitionId")) {
            $scheduleInfo = @{
                StartDateTime = $StartDateTime.ToString("o")
            }

            if ($EndDateTime) {
                $scheduleInfo.Expiration = @{
                    Type = "afterDateTime"
                    EndDateTime = $EndDateTime.ToString("o")
                }
            }
            else {
                $scheduleInfo.Expiration = @{
                    Type = "noExpiration"
                }
            }

            $requestBody = @{
                action = "adminAssign"
                justification = $Justification
                roleDefinitionId = $RoleDefinitionId
                directoryScopeId = "/"
                principalId = $GroupId
                scheduleInfo = $scheduleInfo
            }

            if ($AssignmentType -eq "eligible") {
                $result = New-MgRoleManagementDirectoryRoleEligibilityScheduleRequest -BodyParameter $requestBody
            }
            else {
                $result = New-MgRoleManagementDirectoryRoleAssignmentScheduleRequest -BodyParameter $requestBody
            }

            Write-PIMBuddyLog -Message "Role assignment created successfully" -Level "Success"

            return @{
                Success = $true
                RequestId = $result.Id
                Status = $result.Status
            }
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to add group to role" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Remove-GroupFromEntraRole {
    <#
    .SYNOPSIS
        Remove a group from an Entra ID role
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER RoleDefinitionId
        The ID of the role definition
    .PARAMETER AssignmentType
        Whether to remove eligible or active assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$RoleDefinitionId,

        [ValidateSet("eligible", "active")]
        [string]$AssignmentType = "eligible"
    )

    try {
        Write-PIMBuddyLog -Message "Removing group $GroupId from role $RoleDefinitionId ($AssignmentType)" -Level "Info"

        if ($PSCmdlet.ShouldProcess($GroupId, "Remove $AssignmentType assignment from role $RoleDefinitionId")) {
            $requestBody = @{
                action = "adminRemove"
                roleDefinitionId = $RoleDefinitionId
                directoryScopeId = "/"
                principalId = $GroupId
            }

            if ($AssignmentType -eq "eligible") {
                $result = New-MgRoleManagementDirectoryRoleEligibilityScheduleRequest -BodyParameter $requestBody
            }
            else {
                $result = New-MgRoleManagementDirectoryRoleAssignmentScheduleRequest -BodyParameter $requestBody
            }

            Write-PIMBuddyLog -Message "Role assignment removed successfully" -Level "Success"

            return @{
                Success = $true
                RequestId = $result.Id
            }
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to remove group from role" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Role Policy Management

function Get-EntraRolePolicy {
    <#
    .SYNOPSIS
        Get the PIM policy for an Entra ID role
    .PARAMETER RoleDefinitionId
        The ID of the role definition
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$RoleDefinitionId
    )

    try {
        Write-PIMBuddyLog -Message "Fetching PIM policy for role: $RoleDefinitionId" -Level "Debug"

        # Get the policy for this role
        $policyAssignment = Get-MgPolicyRoleManagementPolicyAssignment -Filter "scopeId eq '/' and scopeType eq 'DirectoryRole' and roleDefinitionId eq '$RoleDefinitionId'" -ExpandProperty "policy(`$expand=rules)"

        if (-not $policyAssignment) {
            return @{
                Success = $false
                Error = "No policy found for this role"
            }
        }

        $policy = $policyAssignment.Policy
        $rules = $policy.Rules

        # Import PolicyManagement to use Parse-PolicyRules
        $policyMgmtPath = Join-Path $PSScriptRoot "PolicyManagement.psm1"
        if (Test-Path $policyMgmtPath) {
            # Parse rules (reuse logic from PolicyManagement)
            $settings = [PSCustomObject]@{
                Activation = [PSCustomObject]@{
                    MaximumDuration = "PT8H"
                    MaximumDurationHours = 8
                    RequireMfa = $false
                    RequireJustification = $false
                    RequireTicketInfo = $false
                    RequireApproval = $false
                    Approvers = @()
                }
                EligibleAssignment = [PSCustomObject]@{
                    AllowPermanent = $true
                    MaximumDurationDays = $null
                }
                ActiveAssignment = [PSCustomObject]@{
                    AllowPermanent = $true
                    MaximumDurationDays = $null
                }
            }

            foreach ($rule in $rules) {
                $ruleType = $rule.AdditionalProperties["@odata.type"]

                switch ($ruleType) {
                    "#microsoft.graph.unifiedRoleManagementPolicyExpirationRule" {
                        $maxDuration = $rule.AdditionalProperties.maximumDuration
                        if ($rule.Id -like "*Activation*" -or $rule.Target.Caller -eq "EndUser") {
                            $settings.Activation.MaximumDuration = $maxDuration
                            if ($maxDuration -match "PT(\d+)H") {
                                $settings.Activation.MaximumDurationHours = [int]$Matches[1]
                            }
                        }
                    }
                    "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule" {
                        $enabledRules = $rule.AdditionalProperties.enabledRules
                        if ($rule.Id -like "*Activation*") {
                            $settings.Activation.RequireMfa = "MultiFactorAuthentication" -in $enabledRules
                            $settings.Activation.RequireJustification = "Justification" -in $enabledRules
                            $settings.Activation.RequireTicketInfo = "Ticketing" -in $enabledRules
                        }
                    }
                    "#microsoft.graph.unifiedRoleManagementPolicyApprovalRule" {
                        $approvalSettings = $rule.AdditionalProperties.setting
                        if ($approvalSettings) {
                            $settings.Activation.RequireApproval = $approvalSettings.isApprovalRequired
                        }
                    }
                }
            }
        }

        return @{
            Success = $true
            PolicyId = $policy.Id
            PolicyAssignmentId = $policyAssignment.Id
            RoleDefinitionId = $RoleDefinitionId
            Settings = $settings
            RawRules = $rules
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get role policy" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Set-EntraRoleActivationSettings {
    <#
    .SYNOPSIS
        Configure activation settings for an Entra ID role
    .PARAMETER RoleDefinitionId
        The ID of the role definition
    .PARAMETER MaximumDurationHours
        Maximum activation duration in hours (1-24)
    .PARAMETER RequireMfa
        Require MFA on activation
    .PARAMETER RequireJustification
        Require justification on activation
    .PARAMETER RequireApproval
        Require approval for activation
    .PARAMETER ApproverIds
        Array of user IDs who can approve
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$RoleDefinitionId,

        [ValidateRange(1, 24)]
        [int]$MaximumDurationHours,

        [bool]$RequireMfa,

        [bool]$RequireJustification,

        [bool]$RequireApproval,

        [string[]]$ApproverIds
    )

    try {
        Write-PIMBuddyLog -Message "Updating activation settings for role: $RoleDefinitionId" -Level "Info"

        # Get current policy
        $currentPolicy = Get-EntraRolePolicy -RoleDefinitionId $RoleDefinitionId
        if (-not $currentPolicy.Success) {
            return $currentPolicy
        }

        $policyId = $currentPolicy.PolicyId
        $rawRules = $currentPolicy.RawRules

        # Find the actual rule IDs from the current policy (they vary by policy)
        $expirationRuleId = "Expiration_EndUser_Assignment"
        $enablementRuleId = "Enablement_EndUser_Assignment"
        $approvalRuleId = "Approval_EndUser_Assignment"

        Write-PIMBuddyLog -Message "Searching for rule IDs in policy $policyId (found $($rawRules.Count) rules)" -Level "Debug"

        foreach ($rule in $rawRules) {
            if (-not $rule) { continue }

            $ruleType = $rule.AdditionalProperties["@odata.type"]
            $ruleId = $rule.Id
            $targetCaller = if ($rule.Target) { $rule.Target.Caller } else { $null }

            Write-PIMBuddyLog -Message "Examining rule: $ruleId (Type: $ruleType, Caller: $targetCaller)" -Level "Debug"

            # Find activation-related rules (EndUser caller or specific patterns)
            if ($ruleId -like "*EndUser*" -or $ruleId -like "*Activation*" -or $targetCaller -eq "EndUser") {
                switch ($ruleType) {
                    "#microsoft.graph.unifiedRoleManagementPolicyExpirationRule" {
                        if ($targetCaller -eq "EndUser" -or $ruleId -like "*Activation*" -or $ruleId -like "*EndUser*") {
                            $expirationRuleId = $ruleId
                            Write-PIMBuddyLog -Message "Found expiration rule: $ruleId" -Level "Debug"
                        }
                    }
                    "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule" {
                        if ($targetCaller -eq "EndUser" -or $ruleId -like "*Activation*" -or $ruleId -like "*EndUser*") {
                            $enablementRuleId = $ruleId
                            Write-PIMBuddyLog -Message "Found enablement rule: $ruleId" -Level "Debug"
                        }
                    }
                    "#microsoft.graph.unifiedRoleManagementPolicyApprovalRule" {
                        $approvalRuleId = $ruleId
                        Write-PIMBuddyLog -Message "Found approval rule: $ruleId" -Level "Debug"
                    }
                }
            }
        }

        Write-PIMBuddyLog -Message "Using rule IDs - Expiration: $expirationRuleId, Enablement: $enablementRuleId, Approval: $approvalRuleId" -Level "Info"

        if ($PSCmdlet.ShouldProcess($RoleDefinitionId, "Update role activation settings")) {
            $updatedRules = @()

            # Update expiration rule
            if ($PSBoundParameters.ContainsKey('MaximumDurationHours')) {
                $duration = ConvertTo-IsoDuration -Hours $MaximumDurationHours
                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"
                    id = $expirationRuleId
                    isExpirationRequired = $true
                    maximumDuration = $duration
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
                Write-PIMBuddyLog -Message "Setting duration to $duration using rule $expirationRuleId" -Level "Debug"
            }

            # Update enablement rule
            if ($PSBoundParameters.ContainsKey('RequireMfa') -or $PSBoundParameters.ContainsKey('RequireJustification')) {
                $enabledRules = @()
                $mfa = if ($PSBoundParameters.ContainsKey('RequireMfa')) { $RequireMfa } else { $currentPolicy.Settings.Activation.RequireMfa }
                $justification = if ($PSBoundParameters.ContainsKey('RequireJustification')) { $RequireJustification } else { $currentPolicy.Settings.Activation.RequireJustification }

                if ($mfa) { $enabledRules += "MultiFactorAuthentication" }
                if ($justification) { $enabledRules += "Justification" }

                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"
                    id = $enablementRuleId
                    enabledRules = $enabledRules
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
            }

            # Update approval rule
            if ($PSBoundParameters.ContainsKey('RequireApproval')) {
                $approvers = @()
                if ($RequireApproval -and $ApproverIds) {
                    foreach ($approverId in $ApproverIds) {
                        $approvers += @{
                            "@odata.type" = "#microsoft.graph.singleUser"
                            id = $approverId
                            description = "Approver"
                            isBackup = $false
                        }
                    }
                }

                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyApprovalRule"
                    id = $approvalRuleId
                    setting = @{
                        isApprovalRequired = $RequireApproval
                        isApprovalRequiredForExtension = $false
                        isRequestorJustificationRequired = $true
                        approvalMode = "SingleStage"
                        approvalStages = @(
                            @{
                                approvalStageTimeOutInDays = 1
                                isApproverJustificationRequired = $true
                                escalationTimeInMinutes = 0
                                isEscalationEnabled = $false
                                primaryApprovers = $approvers
                            }
                        )
                    }
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
            }

            # Apply updates with proper error handling
            $errors = @()
            foreach ($rule in $updatedRules) {
                try {
                    $null = Update-MgPolicyRoleManagementPolicyRule -UnifiedRoleManagementPolicyId $policyId `
                        -UnifiedRoleManagementPolicyRuleId $rule.id -BodyParameter $rule -ErrorAction Stop
                    Write-PIMBuddyLog -Message "Updated rule: $($rule.id)" -Level "Debug"
                }
                catch {
                    $errorMsg = "Failed to update rule $($rule.id): $($_.Exception.Message)"
                    Write-PIMBuddyLog -Message $errorMsg -Level "Error" -Exception $_.Exception
                    $errors += $errorMsg
                }
            }

            if ($errors.Count -gt 0) {
                Write-PIMBuddyLog -Message "Some rule updates failed" -Level "Warning"
                return @{
                    Success = $false
                    Error = $errors -join "; "
                    UpdatedRules = $updatedRules.Count - $errors.Count
                }
            }

            # Wait for API propagation before returning success
            Write-PIMBuddyLog -Message "Waiting for API propagation..." -Level "Debug"
            Start-Sleep -Milliseconds 1500

            Write-PIMBuddyLog -Message "Role activation settings updated successfully" -Level "Success"

            return @{
                Success = $true
                UpdatedRules = $updatedRules.Count
            }
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to update role activation settings" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Role Statistics

function Get-EntraRoleStatistics {
    <#
    .SYNOPSIS
        Get statistics about Entra ID role assignments
    #>
    [CmdletBinding()]
    param()

    try {
        $stats = @{
            TotalRoles = 0
            RolesWithActiveAssignments = 0
            RolesWithEligibleAssignments = 0
            TotalActiveAssignments = 0
            TotalEligibleAssignments = 0
            GlobalAdminCount = 0
            PrivilegedRoleAdminCount = 0
        }

        # Get all role definitions
        $roles = Get-MgRoleManagementDirectoryRoleDefinition -All
        $stats.TotalRoles = $roles.Count

        # Get all active assignments
        $activeAssignments = Get-MgRoleManagementDirectoryRoleAssignment -All
        $stats.TotalActiveAssignments = $activeAssignments.Count

        # Count roles with active assignments
        $rolesWithActive = $activeAssignments | Select-Object -ExpandProperty RoleDefinitionId -Unique
        $stats.RolesWithActiveAssignments = $rolesWithActive.Count

        # Get Global Admin stats
        $globalAdminRole = $roles | Where-Object { $_.DisplayName -eq "Global Administrator" }
        if ($globalAdminRole) {
            $gaAssignments = $activeAssignments | Where-Object { $_.RoleDefinitionId -eq $globalAdminRole.Id }
            $stats.GlobalAdminCount = $gaAssignments.Count
        }

        # Get Privileged Role Admin stats
        $praRole = $roles | Where-Object { $_.DisplayName -eq "Privileged Role Administrator" }
        if ($praRole) {
            $praAssignments = $activeAssignments | Where-Object { $_.RoleDefinitionId -eq $praRole.Id }
            $stats.PrivilegedRoleAdminCount = $praAssignments.Count
        }

        # Get eligible assignments
        try {
            $eligibleAssignments = Get-MgRoleManagementDirectoryRoleEligibilitySchedule -All
            $stats.TotalEligibleAssignments = $eligibleAssignments.Count
            $rolesWithEligible = $eligibleAssignments | Select-Object -ExpandProperty RoleDefinitionId -Unique
            $stats.RolesWithEligibleAssignments = $rolesWithEligible.Count
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to get eligible assignment stats" -Level "Warning"
        }

        return @{
            Success = $true
            Statistics = $stats
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get role statistics" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region High-Privilege Role Detection

function Get-HighPrivilegeRoles {
    <#
    .SYNOPSIS
        Get list of high-privilege roles that require extra scrutiny
    #>
    [CmdletBinding()]
    param()

    # Define high-privilege roles by display name
    $highPrivilegeRoleNames = @(
        "Global Administrator",
        "Privileged Role Administrator",
        "Privileged Authentication Administrator",
        "Security Administrator",
        "User Administrator",
        "Exchange Administrator",
        "SharePoint Administrator",
        "Intune Administrator",
        "Azure AD Joined Device Local Administrator",
        "Cloud Application Administrator",
        "Application Administrator",
        "Authentication Administrator",
        "Billing Administrator",
        "Compliance Administrator",
        "Conditional Access Administrator",
        "Global Reader",
        "Helpdesk Administrator",
        "Password Administrator",
        "Security Operator",
        "Security Reader"
    )

    try {
        $roles = Get-MgRoleManagementDirectoryRoleDefinition -All

        $highPrivilegeRoles = $roles | Where-Object { $_.DisplayName -in $highPrivilegeRoleNames } | ForEach-Object {
            [PSCustomObject]@{
                Id = $_.Id
                DisplayName = $_.DisplayName
                Description = $_.Description
                RiskLevel = switch ($_.DisplayName) {
                    "Global Administrator" { "Critical" }
                    "Privileged Role Administrator" { "Critical" }
                    "Privileged Authentication Administrator" { "Critical" }
                    "Security Administrator" { "High" }
                    "User Administrator" { "High" }
                    default { "Medium" }
                }
            }
        }

        return @{
            Success = $true
            Roles = $highPrivilegeRoles
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get high-privilege roles" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

# Export all functions
Export-ModuleMember -Function *
