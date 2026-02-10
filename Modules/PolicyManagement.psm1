<#
.SYNOPSIS
    PIMBuddy Policy Management Module
.DESCRIPTION
    Functions for configuring PIM policies for groups and roles in Microsoft Entra ID
#>

#region Policy Retrieval

function Get-PIMGroupPolicy {
    <#
    .SYNOPSIS
        Get the PIM policy for a specific group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER AccessId
        The type of access (member or owner)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member"
    )

    try {
        Write-PIMBuddyLog -Message "Fetching PIM policy for group: $GroupId ($AccessId)" -Level "Debug"

        # For PIM Groups, use the roleManagementPolicyAssignments endpoint with proper filters
        # The roleDefinitionId for PIM Groups is 'member' or 'owner'
        $uri = "https://graph.microsoft.com/v1.0/policies/roleManagementPolicyAssignments?`$filter=scopeId eq '$GroupId' and scopeType eq 'Group' and roleDefinitionId eq '$AccessId'&`$expand=policy(`$expand=rules)"

        $policies = Invoke-MgGraphRequest -Method GET -Uri $uri -ErrorAction SilentlyContinue

        if (-not $policies -or -not $policies.value -or $policies.value.Count -eq 0) {
            # Try without roleDefinitionId filter
            $uri = "https://graph.microsoft.com/v1.0/policies/roleManagementPolicyAssignments?`$filter=scopeId eq '$GroupId' and scopeType eq 'Group'&`$expand=policy(`$expand=rules)"
            $policies = Invoke-MgGraphRequest -Method GET -Uri $uri -ErrorAction SilentlyContinue
        }

        if (-not $policies -or -not $policies.value -or $policies.value.Count -eq 0) {
            # No policy found - this is normal for groups without PIM enabled
            Write-PIMBuddyLog -Message "No PIM policy found for group $GroupId - using default settings" -Level "Debug"
            return @{
                Success = $true
                PolicyId = $null
                GroupId = $GroupId
                AccessId = $AccessId
                Settings = Get-DefaultPolicySettings
                RawRules = @()
                IsDefault = $true
            }
        }

        # Find the matching policy assignment for this access type
        $policyAssignment = $policies.value | Where-Object { $_.roleDefinitionId -eq $AccessId } | Select-Object -First 1
        if (-not $policyAssignment) {
            $policyAssignment = $policies.value | Select-Object -First 1
        }

        $policy = $policyAssignment.policy

        # Handle case where policy or rules is null
        if (-not $policy) {
            Write-PIMBuddyLog -Message "Policy object is null for group $GroupId - using default settings" -Level "Debug"
            return @{
                Success = $true
                PolicyId = $null
                GroupId = $GroupId
                AccessId = $AccessId
                Settings = Get-DefaultPolicySettings
                RawRules = @()
                IsDefault = $true
            }
        }

        $rules = $policy.rules

        # If rules is null or empty, use default settings but still return the policy ID
        if (-not $rules -or $rules.Count -eq 0) {
            Write-PIMBuddyLog -Message "Policy rules are empty for group $GroupId - using default settings with policy ID" -Level "Debug"
            return @{
                Success = $true
                PolicyId = $policy.id
                PolicyAssignmentId = $policyAssignment.id
                GroupId = $GroupId
                AccessId = $AccessId
                Settings = Get-DefaultPolicySettings
                RawRules = @()
                IsDefault = $false
            }
        }

        # Parse rules into a structured object
        $policySettings = Parse-PolicyRules -Rules $rules

        return @{
            Success = $true
            PolicyId = $policy.id
            PolicyAssignmentId = $policyAssignment.id
            GroupId = $GroupId
            AccessId = $AccessId
            Settings = $policySettings
            RawRules = $rules
            IsDefault = $false
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get PIM policy: $($_.Exception.Message)" -Level "Warning" -Exception $_.Exception
        # Return default policy settings on error
        return @{
            Success = $true
            PolicyId = $null
            GroupId = $GroupId
            AccessId = $AccessId
            Settings = Get-DefaultPolicySettings
            RawRules = @()
            IsDefault = $true
        }
    }
}

function Get-DefaultPolicySettings {
    <#
    .SYNOPSIS
        Return default policy settings when no specific policy is found
    #>
    return [PSCustomObject]@{
        Activation = [PSCustomObject]@{
            MaximumDuration = "PT8H"
            MaximumDurationHours = 8
            RequireMfa = $false
            RequireJustification = $false
            RequireTicketInfo = $false
            RequireApproval = $false
            Approvers = @()
            AuthenticationContext = $null
        }
        EligibleAssignment = [PSCustomObject]@{
            AllowPermanent = $true
            MaximumDuration = $null
            MaximumDurationDays = $null
            RequireMfa = $false
            RequireJustification = $false
        }
        ActiveAssignment = [PSCustomObject]@{
            AllowPermanent = $true
            MaximumDuration = $null
            MaximumDurationDays = $null
            RequireMfa = $false
            RequireJustification = $false
        }
        Notification = [PSCustomObject]@{
            NotifyAssigneeOnActivation = $true
            NotifyAssigneeOnAssignment = $true
            NotifyRequestorOnActivation = $false
            NotifyApproversOnActivation = $true
            AdditionalRecipients = @()
        }
    }
}

function Parse-PolicyRules {
    <#
    .SYNOPSIS
        Parse policy rules into a structured settings object
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        $Rules
    )

    $settings = [PSCustomObject]@{
        Activation = [PSCustomObject]@{
            MaximumDuration = "PT8H"
            MaximumDurationHours = 8
            RequireMfa = $false
            RequireJustification = $false
            RequireTicketInfo = $false
            RequireApproval = $false
            Approvers = @()
            AuthenticationContext = $null
        }
        EligibleAssignment = [PSCustomObject]@{
            AllowPermanent = $true
            MaximumDuration = $null
            MaximumDurationDays = $null
            RequireMfa = $false
            RequireJustification = $false
        }
        ActiveAssignment = [PSCustomObject]@{
            AllowPermanent = $true
            MaximumDuration = $null
            MaximumDurationDays = $null
            RequireMfa = $false
            RequireJustification = $false
        }
        Notification = [PSCustomObject]@{
            NotifyAssigneeOnActivation = $true
            NotifyAssigneeOnAssignment = $true
            NotifyRequestorOnActivation = $false
            NotifyApproversOnActivation = $true
            AdditionalRecipients = @()
        }
    }

    foreach ($rule in $Rules) {
        # Skip rules without AdditionalProperties
        if (-not $rule -or -not $rule.AdditionalProperties) { continue }

        $ruleType = $rule.AdditionalProperties["@odata.type"]
        if (-not $ruleType) { continue }

        switch ($ruleType) {
            "#microsoft.graph.unifiedRoleManagementPolicyExpirationRule" {
                $target = if ($rule.Target) { $rule.Target.Caller } else { $null }
                $maxDuration = $rule.AdditionalProperties.maximumDuration
                $isExpirationRequired = $rule.AdditionalProperties.isExpirationRequired

                if ($rule.Id -like "*Activation*" -or $target -eq "EndUser") {
                    $settings.Activation.MaximumDuration = $maxDuration
                    $settings.Activation.MaximumDurationHours = ConvertFrom-IsoDuration -Duration $maxDuration
                }
                elseif ($rule.Id -like "*Eligibility*") {
                    $settings.EligibleAssignment.AllowPermanent = -not $isExpirationRequired
                    $settings.EligibleAssignment.MaximumDuration = $maxDuration
                    if ($maxDuration) {
                        $settings.EligibleAssignment.MaximumDurationDays = [int]($maxDuration -replace 'P|D', '')
                    }
                }
                elseif ($rule.Id -like "*Assignment*") {
                    $settings.ActiveAssignment.AllowPermanent = -not $isExpirationRequired
                    $settings.ActiveAssignment.MaximumDuration = $maxDuration
                    if ($maxDuration) {
                        $settings.ActiveAssignment.MaximumDurationDays = [int]($maxDuration -replace 'P|D', '')
                    }
                }
            }

            "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule" {
                $enabledRules = $rule.AdditionalProperties.enabledRules
                if (-not $enabledRules) { $enabledRules = @() }

                if ($rule.Id -like "*Activation*") {
                    $settings.Activation.RequireMfa = "MultiFactorAuthentication" -in $enabledRules
                    $settings.Activation.RequireJustification = "Justification" -in $enabledRules
                    $settings.Activation.RequireTicketInfo = "Ticketing" -in $enabledRules
                }
                elseif ($rule.Id -like "*Assignment*") {
                    $settings.ActiveAssignment.RequireMfa = "MultiFactorAuthentication" -in $enabledRules
                    $settings.ActiveAssignment.RequireJustification = "Justification" -in $enabledRules
                }
            }

            "#microsoft.graph.unifiedRoleManagementPolicyApprovalRule" {
                $approvalSettings = $rule.AdditionalProperties.setting
                if ($approvalSettings) {
                    $settings.Activation.RequireApproval = $approvalSettings.isApprovalRequired
                    $approvalStages = $approvalSettings.approvalStages
                    if ($approvalStages -and $approvalStages -is [array] -and $approvalStages.Count -gt 0) {
                        $stage = $approvalStages[0]
                        if ($stage -and $stage.primaryApprovers) {
                            $settings.Activation.Approvers = @($stage.primaryApprovers | ForEach-Object {
                                if ($_) {
                                    [PSCustomObject]@{
                                        Id = if ($_.ContainsKey("id")) { $_["id"] } else { $null }
                                        Description = if ($_.ContainsKey("description")) { $_["description"] } else { $null }
                                        Type = if ($_.ContainsKey("@odata.type")) { $_["@odata.type"] } else { $null }
                                    }
                                }
                            })
                        }
                    }
                }
            }

            "#microsoft.graph.unifiedRoleManagementPolicyAuthenticationContextRule" {
                $settings.Activation.AuthenticationContext = $rule.AdditionalProperties.claimValue
            }

            "#microsoft.graph.unifiedRoleManagementPolicyNotificationRule" {
                $notificationType = $rule.AdditionalProperties.notificationType
                $recipientType = $rule.AdditionalProperties.recipientType
                $isEnabled = $rule.AdditionalProperties.isDefaultRecipientsEnabled

                if ($rule.Id -like "*Notification_Requestor*") {
                    $settings.Notification.NotifyRequestorOnActivation = $isEnabled
                }
                elseif ($rule.Id -like "*Notification_Approver*") {
                    $settings.Notification.NotifyApproversOnActivation = $isEnabled
                }
                elseif ($rule.Id -like "*Notification_Admin*") {
                    if ($rule.AdditionalProperties.notificationRecipients) {
                        $settings.Notification.AdditionalRecipients = $rule.AdditionalProperties.notificationRecipients
                    }
                }
            }
        }
    }

    return $settings
}

#endregion

#region Policy Updates

function Set-PIMGroupActivationSettings {
    <#
    .SYNOPSIS
        Configure activation settings for a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER MaximumDurationHours
        Maximum activation duration in hours (1-24)
    .PARAMETER RequireMfa
        Require MFA on activation
    .PARAMETER RequireJustification
        Require justification on activation
    .PARAMETER RequireTicketInfo
        Require ticket information on activation
    .PARAMETER RequireApproval
        Require approval for activation
    .PARAMETER ApproverIds
        Array of user IDs who can approve
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [ValidateRange(1, 24)]
        [int]$MaximumDurationHours,

        [bool]$RequireMfa,

        [bool]$RequireJustification,

        [bool]$RequireTicketInfo,

        [bool]$RequireApproval,

        [string[]]$ApproverIds
    )

    try {
        Write-PIMBuddyLog -Message "Updating activation settings for group: $GroupId" -Level "Info"

        # Get current policy
        $currentPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId $AccessId
        if (-not $currentPolicy.Success) {
            return $currentPolicy
        }

        # Check if we have a valid policy ID
        if (-not $currentPolicy.PolicyId -or $currentPolicy.IsDefault) {
            Write-PIMBuddyLog -Message "No PIM policy found for group $GroupId. The group may need PIM to be enabled first." -Level "Warning"
            return @{
                Success = $false
                Error = "No PIM policy found for this group. Ensure the group is a role-assignable security group with PIM enabled. Try adding an eligible assignment to the group first."
            }
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

        if ($PSCmdlet.ShouldProcess($GroupId, "Update activation settings")) {
            $updatedRules = @()

            # Update expiration rule (duration)
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

            # Update enablement rule (MFA, justification, ticket)
            if ($PSBoundParameters.ContainsKey('RequireMfa') -or
                $PSBoundParameters.ContainsKey('RequireJustification') -or
                $PSBoundParameters.ContainsKey('RequireTicketInfo')) {

                $enabledRules = @()
                $mfa = if ($PSBoundParameters.ContainsKey('RequireMfa')) { $RequireMfa } else { $currentPolicy.Settings.Activation.RequireMfa }
                $justification = if ($PSBoundParameters.ContainsKey('RequireJustification')) { $RequireJustification } else { $currentPolicy.Settings.Activation.RequireJustification }
                $ticket = if ($PSBoundParameters.ContainsKey('RequireTicketInfo')) { $RequireTicketInfo } else { $currentPolicy.Settings.Activation.RequireTicketInfo }

                if ($mfa) { $enabledRules += "MultiFactorAuthentication" }
                if ($justification) { $enabledRules += "Justification" }
                if ($ticket) { $enabledRules += "Ticketing" }

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

            Write-PIMBuddyLog -Message "Activation settings updated successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to update activation settings" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Set-PIMGroupAssignmentSettings {
    <#
    .SYNOPSIS
        Configure assignment settings for a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER AssignmentType
        Whether to configure eligible or active assignments
    .PARAMETER AllowPermanent
        Allow permanent assignments
    .PARAMETER MaximumDurationDays
        Maximum assignment duration in days (if not permanent)
    .PARAMETER RequireMfa
        Require MFA when making assignment
    .PARAMETER RequireJustification
        Require justification when making assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [ValidateSet("eligible", "active")]
        [string]$AssignmentType = "eligible",

        [bool]$AllowPermanent,

        [int]$MaximumDurationDays,

        [bool]$RequireMfa,

        [bool]$RequireJustification
    )

    try {
        Write-PIMBuddyLog -Message "Updating $AssignmentType assignment settings for group: $GroupId" -Level "Info"

        # Get current policy
        $currentPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId $AccessId
        if (-not $currentPolicy.Success) {
            return $currentPolicy
        }

        # Check if we have a valid policy ID
        if (-not $currentPolicy.PolicyId -or $currentPolicy.IsDefault) {
            Write-PIMBuddyLog -Message "No PIM policy found for group $GroupId. The group may need PIM to be enabled first." -Level "Warning"
            return @{
                Success = $false
                Error = "No PIM policy found for this group. Ensure the group is a role-assignable security group with PIM enabled."
            }
        }

        $policyId = $currentPolicy.PolicyId
        $ruleIdSuffix = if ($AssignmentType -eq "eligible") { "Eligibility" } else { "Assignment" }

        if ($PSCmdlet.ShouldProcess($GroupId, "Update $AssignmentType assignment settings")) {
            $updatedRules = @()

            # Update expiration rule
            if ($PSBoundParameters.ContainsKey('AllowPermanent') -or $PSBoundParameters.ContainsKey('MaximumDurationDays')) {
                $isExpirationRequired = -not $AllowPermanent
                $duration = if ($MaximumDurationDays) { "P${MaximumDurationDays}D" } else { "P365D" }

                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"
                    id = "Expiration_Admin_$ruleIdSuffix"
                    isExpirationRequired = $isExpirationRequired
                    maximumDuration = $duration
                    target = @{
                        caller = "Admin"
                        operations = @("All")
                        level = $ruleIdSuffix
                    }
                }
            }

            # Update enablement rule (for active assignments)
            if ($AssignmentType -eq "active" -and
                ($PSBoundParameters.ContainsKey('RequireMfa') -or $PSBoundParameters.ContainsKey('RequireJustification'))) {

                $enabledRules = @()
                if ($RequireMfa) { $enabledRules += "MultiFactorAuthentication" }
                if ($RequireJustification) { $enabledRules += "Justification" }

                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"
                    id = "Enablement_Admin_Assignment"
                    enabledRules = $enabledRules
                    target = @{
                        caller = "Admin"
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

            Write-PIMBuddyLog -Message "$AssignmentType assignment settings updated successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to update assignment settings" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Set-PIMGroupNotificationSettings {
    <#
    .SYNOPSIS
        Configure notification settings for a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER NotifyAssignee
        Notify the assignee on assignment
    .PARAMETER NotifyApprovers
        Notify approvers when approval is needed
    .PARAMETER AdditionalRecipients
        Array of email addresses for additional notifications
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [bool]$NotifyAssignee,

        [bool]$NotifyApprovers,

        [string[]]$AdditionalRecipients
    )

    try {
        Write-PIMBuddyLog -Message "Updating notification settings for group: $GroupId" -Level "Info"

        # Get current policy
        $currentPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId $AccessId
        if (-not $currentPolicy.Success) {
            return $currentPolicy
        }

        $policyId = $currentPolicy.PolicyId

        if ($PSCmdlet.ShouldProcess($GroupId, "Update notification settings")) {
            $updatedRules = @()

            if ($PSBoundParameters.ContainsKey('NotifyAssignee')) {
                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyNotificationRule"
                    id = "Notification_Requestor_EndUser_Assignment"
                    isDefaultRecipientsEnabled = $NotifyAssignee
                    notificationLevel = "All"
                    notificationType = "Email"
                    recipientType = "Requestor"
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
            }

            if ($PSBoundParameters.ContainsKey('NotifyApprovers')) {
                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyNotificationRule"
                    id = "Notification_Approver_EndUser_Assignment"
                    isDefaultRecipientsEnabled = $NotifyApprovers
                    notificationLevel = "All"
                    notificationType = "Email"
                    recipientType = "Approver"
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
            }

            if ($PSBoundParameters.ContainsKey('AdditionalRecipients')) {
                $updatedRules += @{
                    "@odata.type" = "#microsoft.graph.unifiedRoleManagementPolicyNotificationRule"
                    id = "Notification_Admin_EndUser_Assignment"
                    isDefaultRecipientsEnabled = $true
                    notificationLevel = "All"
                    notificationType = "Email"
                    recipientType = "Admin"
                    notificationRecipients = $AdditionalRecipients
                    target = @{
                        caller = "EndUser"
                        operations = @("All")
                        level = "Assignment"
                    }
                }
            }

            # Apply updates
            foreach ($rule in $updatedRules) {
                Update-MgPolicyRoleManagementPolicyRule -UnifiedRoleManagementPolicyId $policyId `
                    -UnifiedRoleManagementPolicyRuleId $rule.id -BodyParameter $rule
            }

            Write-PIMBuddyLog -Message "Notification settings updated successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to update notification settings" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Full Policy Application

function Set-PIMGroupPolicyFull {
    <#
    .SYNOPSIS
        Apply a complete policy configuration to a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER PolicySettings
        Hashtable containing all policy settings
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [Parameter(Mandatory)]
        [hashtable]$PolicySettings
    )

    try {
        Write-PIMBuddyLog -Message "Applying full policy configuration to group: $GroupId" -Level "Info"

        $results = @{
            Success = $true
            ActivationResult = $null
            EligibleAssignmentResult = $null
            ActiveAssignmentResult = $null
            NotificationResult = $null
            Errors = @()
        }

        if ($PSCmdlet.ShouldProcess($GroupId, "Apply full policy configuration")) {
            # Apply activation settings
            if ($PolicySettings.ContainsKey('Activation')) {
                $activationParams = @{
                    GroupId = $GroupId
                    AccessId = $AccessId
                }

                $activation = $PolicySettings.Activation
                if ($activation.MaximumDurationHours) { $activationParams.MaximumDurationHours = $activation.MaximumDurationHours }
                if ($null -ne $activation.RequireMfa) { $activationParams.RequireMfa = $activation.RequireMfa }
                if ($null -ne $activation.RequireJustification) { $activationParams.RequireJustification = $activation.RequireJustification }
                if ($null -ne $activation.RequireTicketInfo) { $activationParams.RequireTicketInfo = $activation.RequireTicketInfo }
                if ($null -ne $activation.RequireApproval) {
                    $activationParams.RequireApproval = $activation.RequireApproval
                    if ($activation.ApproverIds) { $activationParams.ApproverIds = $activation.ApproverIds }
                }

                $results.ActivationResult = Set-PIMGroupActivationSettings @activationParams
                if (-not $results.ActivationResult.Success) {
                    $results.Errors += "Activation: $($results.ActivationResult.Error)"
                }
            }

            # Apply eligible assignment settings
            if ($PolicySettings.ContainsKey('EligibleAssignment')) {
                $eligibleParams = @{
                    GroupId = $GroupId
                    AccessId = $AccessId
                    AssignmentType = "eligible"
                }

                $eligible = $PolicySettings.EligibleAssignment
                if ($null -ne $eligible.AllowPermanent) { $eligibleParams.AllowPermanent = $eligible.AllowPermanent }
                if ($eligible.MaximumDurationDays) { $eligibleParams.MaximumDurationDays = $eligible.MaximumDurationDays }

                $results.EligibleAssignmentResult = Set-PIMGroupAssignmentSettings @eligibleParams
                if (-not $results.EligibleAssignmentResult.Success) {
                    $results.Errors += "Eligible Assignment: $($results.EligibleAssignmentResult.Error)"
                }
            }

            # Apply active assignment settings
            if ($PolicySettings.ContainsKey('ActiveAssignment')) {
                $activeParams = @{
                    GroupId = $GroupId
                    AccessId = $AccessId
                    AssignmentType = "active"
                }

                $active = $PolicySettings.ActiveAssignment
                if ($null -ne $active.AllowPermanent) { $activeParams.AllowPermanent = $active.AllowPermanent }
                if ($active.MaximumDurationDays) { $activeParams.MaximumDurationDays = $active.MaximumDurationDays }
                if ($null -ne $active.RequireMfa) { $activeParams.RequireMfa = $active.RequireMfa }
                if ($null -ne $active.RequireJustification) { $activeParams.RequireJustification = $active.RequireJustification }

                $results.ActiveAssignmentResult = Set-PIMGroupAssignmentSettings @activeParams
                if (-not $results.ActiveAssignmentResult.Success) {
                    $results.Errors += "Active Assignment: $($results.ActiveAssignmentResult.Error)"
                }
            }

            # Apply notification settings
            if ($PolicySettings.ContainsKey('Notification')) {
                $notifParams = @{
                    GroupId = $GroupId
                    AccessId = $AccessId
                }

                $notif = $PolicySettings.Notification
                if ($null -ne $notif.NotifyAssignee) { $notifParams.NotifyAssignee = $notif.NotifyAssignee }
                if ($null -ne $notif.NotifyApprovers) { $notifParams.NotifyApprovers = $notif.NotifyApprovers }
                if ($notif.AdditionalRecipients) { $notifParams.AdditionalRecipients = $notif.AdditionalRecipients }

                $results.NotificationResult = Set-PIMGroupNotificationSettings @notifParams
                if (-not $results.NotificationResult.Success) {
                    $results.Errors += "Notification: $($results.NotificationResult.Error)"
                }
            }

            $results.Success = $results.Errors.Count -eq 0

            Write-PIMBuddyLog -Message "Full policy application completed. Errors: $($results.Errors.Count)" -Level $(if ($results.Success) { "Success" } else { "Warning" })
        }

        return $results
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to apply full policy" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Policy Export/Import

function Export-PIMGroupPolicy {
    <#
    .SYNOPSIS
        Export a PIM group policy to JSON
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER FilePath
        Path to save the JSON file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$FilePath
    )

    try {
        # Get policies for both member and owner access
        $memberPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId "member"
        $ownerPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId "owner"

        # Get group info
        $group = Get-MgGroup -GroupId $GroupId -Property "DisplayName,Description"

        $exportData = @{
            ExportDate = (Get-Date).ToString("o")
            ExportedBy = (Get-MgContext).Account
            Group = @{
                Id = $GroupId
                DisplayName = $group.DisplayName
                Description = $group.Description
            }
            Policies = @{
                Member = if ($memberPolicy.Success) { $memberPolicy.Settings } else { $null }
                Owner = if ($ownerPolicy.Success) { $ownerPolicy.Settings } else { $null }
            }
        }

        $success = Export-ToJson -Data $exportData -FilePath $FilePath

        return @{
            Success = $success
            FilePath = $FilePath
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to export policy" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Import-PIMGroupPolicy {
    <#
    .SYNOPSIS
        Import and apply a PIM group policy from JSON
    .PARAMETER FilePath
        Path to the JSON file
    .PARAMETER TargetGroupId
        The ID of the group to apply the policy to
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [Parameter(Mandatory)]
        [string]$TargetGroupId
    )

    try {
        $importResult = Import-FromJson -FilePath $FilePath
        if (-not $importResult.Success) {
            return $importResult
        }

        $policyData = $importResult.Data

        if ($PSCmdlet.ShouldProcess($TargetGroupId, "Import policy from $FilePath")) {
            $results = @{
                Success = $true
                MemberResult = $null
                OwnerResult = $null
            }

            # Apply member policy
            if ($policyData.Policies.Member) {
                $memberSettings = @{}
                $policyData.Policies.Member.PSObject.Properties | ForEach-Object {
                    $memberSettings[$_.Name] = $_.Value
                }
                $results.MemberResult = Set-PIMGroupPolicyFull -GroupId $TargetGroupId -AccessId "member" -PolicySettings $memberSettings
            }

            # Apply owner policy
            if ($policyData.Policies.Owner) {
                $ownerSettings = @{}
                $policyData.Policies.Owner.PSObject.Properties | ForEach-Object {
                    $ownerSettings[$_.Name] = $_.Value
                }
                $results.OwnerResult = Set-PIMGroupPolicyFull -GroupId $TargetGroupId -AccessId "owner" -PolicySettings $ownerSettings
            }

            $results.Success = ($null -eq $results.MemberResult -or $results.MemberResult.Success) -and
                              ($null -eq $results.OwnerResult -or $results.OwnerResult.Success)

            return $results
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to import policy" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

# Export all functions
Export-ModuleMember -Function *
