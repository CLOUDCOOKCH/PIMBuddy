<#
.SYNOPSIS
    PIMBuddy Group Management Module
.DESCRIPTION
    Functions for creating and managing PIM-enabled groups in Microsoft Entra ID
#>

#region Group Creation

function New-PIMGroup {
    <#
    .SYNOPSIS
        Create a new role-assignable security group for PIM
    .PARAMETER DisplayName
        The display name of the group
    .PARAMETER Description
        The description of the group
    .PARAMETER MailNickname
        The mail nickname (alias) for the group
    .PARAMETER Owners
        Array of user IDs to add as owners
    .PARAMETER Members
        Array of user IDs to add as members
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$DisplayName,

        [string]$Description = "",

        [Parameter(Mandatory)]
        [string]$MailNickname,

        [string[]]$Owners = @(),

        [string[]]$Members = @()
    )

    try {
        # Validate inputs
        $nameValidation = Test-GroupNameValid -Name $DisplayName
        if (-not $nameValidation.Valid) {
            return @{
                Success = $false
                Error = $nameValidation.Message
            }
        }

        $nicknameValidation = Test-MailNicknameValid -MailNickname $MailNickname
        if (-not $nicknameValidation.Valid) {
            return @{
                Success = $false
                Error = $nicknameValidation.Message
            }
        }

        Write-PIMBuddyLog -Message "Creating PIM group: $DisplayName" -Level "Info"

        if ($PSCmdlet.ShouldProcess($DisplayName, "Create PIM Group")) {
            # Build group parameters
            $groupParams = @{
                DisplayName = $DisplayName
                Description = $Description
                MailEnabled = $false
                MailNickname = $MailNickname
                SecurityEnabled = $true
                IsAssignableToRole = $true  # Required for PIM
                GroupTypes = @()  # Empty for security group
            }

            # Create the group with error handling
            try {
                $group = New-MgGroup -BodyParameter $groupParams -ErrorAction Stop
            }
            catch {
                $errMsg = $_.Exception.Message
                Write-PIMBuddyLog -Message "New-MgGroup failed: $errMsg" -Level "Error" -Exception $_.Exception

                # Check for specific error types
                if ($errMsg -match "InsufficientPermissions|Authorization") {
                    return @{
                        Success = $false
                        Error = "Insufficient permissions to create role-assignable groups. Required: Directory.ReadWrite.All and RoleManagement.ReadWrite.Directory"
                    }
                }
                elseif ($errMsg -match "isAssignableToRole|IsAssignableToRole") {
                    return @{
                        Success = $false
                        Error = "Cannot create role-assignable group. Your tenant may not support this feature or you lack permissions."
                    }
                }

                return @{
                    Success = $false
                    Error = Get-FriendlyErrorMessage -Exception $_.Exception
                }
            }

            # Verify the group was actually created
            if (-not $group -or -not $group.Id) {
                Write-PIMBuddyLog -Message "Group creation returned null or empty ID" -Level "Error"
                return @{
                    Success = $false
                    Error = "Group creation failed - no group returned from API"
                }
            }

            # Wait a moment for replication and verify the group exists
            Start-Sleep -Milliseconds 500
            try {
                $verifyGroup = Get-MgGroup -GroupId $group.Id -ErrorAction Stop
                if (-not $verifyGroup) {
                    throw "Group verification returned null"
                }
                Write-PIMBuddyLog -Message "Group verified with ID: $($group.Id)" -Level "Debug"
            }
            catch {
                Write-PIMBuddyLog -Message "Group created but verification failed (may need more time to replicate): $($_.Exception.Message)" -Level "Warning"
            }

            Write-PIMBuddyLog -Message "Group created with ID: $($group.Id)" -Level "Success"

            # Add owners if specified
            if ($Owners.Count -gt 0) {
                foreach ($ownerId in $Owners) {
                    try {
                        $ownerRef = @{
                            "@odata.id" = "https://graph.microsoft.com/v1.0/users/$ownerId"
                        }
                        New-MgGroupOwnerByRef -GroupId $group.Id -BodyParameter $ownerRef
                        Write-PIMBuddyLog -Message "Added owner: $ownerId" -Level "Debug"
                    }
                    catch {
                        Write-PIMBuddyLog -Message "Failed to add owner $ownerId" -Level "Warning" -Exception $_.Exception
                    }
                }
            }

            # Add members if specified
            if ($Members.Count -gt 0) {
                foreach ($memberId in $Members) {
                    try {
                        $memberRef = @{
                            "@odata.id" = "https://graph.microsoft.com/v1.0/users/$memberId"
                        }
                        New-MgGroupMemberByRef -GroupId $group.Id -BodyParameter $memberRef
                        Write-PIMBuddyLog -Message "Added member: $memberId" -Level "Debug"
                    }
                    catch {
                        Write-PIMBuddyLog -Message "Failed to add member $memberId" -Level "Warning" -Exception $_.Exception
                    }
                }
            }

            return @{
                Success = $true
                Group = $group
                GroupId = $group.Id
            }
        }

        return @{
            Success = $false
            Error = "Operation cancelled by user"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to create group: $DisplayName" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Group Retrieval

function Get-PIMGroups {
    <#
    .SYNOPSIS
        Get all PIM-enabled (role-assignable) groups
    .PARAMETER Filter
        Optional filter string for display name
    .PARAMETER IncludeMemberCount
        Include member and owner counts (slower)
    #>
    [CmdletBinding()]
    param(
        [string]$Filter = "",

        [switch]$IncludeMemberCount
    )

    try {
        Write-PIMBuddyLog -Message "Fetching PIM groups..." -Level "Debug"

        # Get all role-assignable groups
        $filterQuery = "isAssignableToRole eq true"
        if ($Filter) {
            $filterQuery += " and contains(displayName, '$Filter')"
        }

        $groups = Get-MgGroup -Filter $filterQuery -Property "Id,DisplayName,Description,CreatedDateTime,Mail,MailNickname" -All

        # PERFORMANCE: Use List<T> instead of array += to avoid O(n²) complexity
        $result = [System.Collections.Generic.List[PSCustomObject]]::new()

        foreach ($group in $groups) {
            $groupData = [PSCustomObject]@{
                Id = $group.Id
                DisplayName = $group.DisplayName
                Description = $group.Description
                MailNickname = $group.MailNickname
                CreatedDateTime = $group.CreatedDateTime
                MemberCount = 0
                OwnerCount = 0
            }

            if ($IncludeMemberCount) {
                try {
                    # PERFORMANCE NOTE: These sequential API calls are slow for many groups
                    # Consider using batch requests or $count=true in production
                    $members = Get-MgGroupMember -GroupId $group.Id -All
                    $owners = Get-MgGroupOwner -GroupId $group.Id -All
                    $groupData.MemberCount = @($members).Count
                    $groupData.OwnerCount = @($owners).Count
                }
                catch {
                    Write-PIMBuddyLog -Message "Failed to get member counts for group $($group.Id)" -Level "Warning"
                }
            }

            $result.Add($groupData)
        }

        Write-PIMBuddyLog -Message "Found $($result.Count) PIM groups" -Level "Info"

        return @{
            Success = $true
            Groups = @($result)  # Convert to array for compatibility
            Count = $result.Count
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to fetch PIM groups" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Groups = @()
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Get-PIMGroupDetails {
    <#
    .SYNOPSIS
        Get detailed information about a specific PIM group
    .PARAMETER GroupId
        The ID of the group
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId
    )

    try {
        Write-PIMBuddyLog -Message "Fetching group details: $GroupId" -Level "Debug"

        # Get group
        $group = Get-MgGroup -GroupId $GroupId

        # Get members (ensure result is always an array)
        $members = @(Get-MgGroupMember -GroupId $GroupId -All | ForEach-Object {
            $user = Get-MgUser -UserId $_.Id -Property "Id,DisplayName,UserPrincipalName" -ErrorAction SilentlyContinue
            if ($user) {
                [PSCustomObject]@{
                    Id = $user.Id
                    DisplayName = $user.DisplayName
                    UserPrincipalName = $user.UserPrincipalName
                    Type = "Member"
                }
            }
        })

        # Get owners (ensure result is always an array)
        $owners = @(Get-MgGroupOwner -GroupId $GroupId -All | ForEach-Object {
            $user = Get-MgUser -UserId $_.Id -Property "Id,DisplayName,UserPrincipalName" -ErrorAction SilentlyContinue
            if ($user) {
                [PSCustomObject]@{
                    Id = $user.Id
                    DisplayName = $user.DisplayName
                    UserPrincipalName = $user.UserPrincipalName
                    Type = "Owner"
                }
            }
        })

        # Get eligible assignments
        $eligibleAssignments = @()
        try {
            $eligible = Get-MgIdentityGovernancePrivilegedAccessGroupEligibilitySchedule -Filter "groupId eq '$GroupId'" -All
            foreach ($assignment in $eligible) {
                $principal = Get-MgUser -UserId $assignment.PrincipalId -Property "DisplayName,UserPrincipalName" -ErrorAction SilentlyContinue
                $eligibleAssignments += [PSCustomObject]@{
                    Id = $assignment.Id
                    PrincipalId = $assignment.PrincipalId
                    PrincipalName = if ($principal) { $principal.DisplayName } else { $assignment.PrincipalId }
                    AccessId = $assignment.AccessId
                    StartDateTime = $assignment.ScheduleInfo.StartDateTime
                    EndDateTime = $assignment.ScheduleInfo.Expiration.EndDateTime
                    Status = $assignment.Status
                }
            }
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to get eligible assignments" -Level "Warning" -Exception $_.Exception
        }

        # Get active assignments
        $activeAssignments = @()
        try {
            $active = Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentSchedule -Filter "groupId eq '$GroupId'" -All
            foreach ($assignment in $active) {
                $principal = Get-MgUser -UserId $assignment.PrincipalId -Property "DisplayName,UserPrincipalName" -ErrorAction SilentlyContinue
                $activeAssignments += [PSCustomObject]@{
                    Id = $assignment.Id
                    PrincipalId = $assignment.PrincipalId
                    PrincipalName = if ($principal) { $principal.DisplayName } else { $assignment.PrincipalId }
                    AccessId = $assignment.AccessId
                    StartDateTime = $assignment.ScheduleInfo.StartDateTime
                    EndDateTime = $assignment.ScheduleInfo.Expiration.EndDateTime
                    Status = $assignment.Status
                }
            }
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to get active assignments" -Level "Warning" -Exception $_.Exception
        }

        return @{
            Success = $true
            Group = [PSCustomObject]@{
                Id = $group.Id
                DisplayName = $group.DisplayName
                Description = $group.Description
                MailNickname = $group.MailNickname
                CreatedDateTime = $group.CreatedDateTime
                IsAssignableToRole = $group.IsAssignableToRole
            }
            Members = $members
            Owners = $owners
            EligibleAssignments = $eligibleAssignments
            ActiveAssignments = $activeAssignments
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get group details" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Group Deletion

function Remove-PIMGroup {
    <#
    .SYNOPSIS
        Delete a PIM group
    .PARAMETER GroupId
        The ID of the group to delete
    .PARAMETER Force
        Skip confirmation prompt
    #>
    [CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High')]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [switch]$Force
    )

    try {
        # Get group name for confirmation
        $group = Get-MgGroup -GroupId $GroupId -Property "DisplayName"
        $groupName = $group.DisplayName

        Write-PIMBuddyLog -Message "Attempting to delete group: $groupName ($GroupId)" -Level "Info"

        if ($Force -or $PSCmdlet.ShouldProcess($groupName, "Delete PIM Group")) {
            Remove-MgGroup -GroupId $GroupId
            Write-PIMBuddyLog -Message "Group deleted: $groupName" -Level "Success"

            return @{
                Success = $true
                GroupId = $GroupId
                GroupName = $groupName
            }
        }

        return @{
            Success = $false
            Error = "Operation cancelled by user"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to delete group: $GroupId" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region PIM Assignments

function Add-PIMGroupEligibleMember {
    <#
    .SYNOPSIS
        Add an eligible member assignment to a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER PrincipalId
        The ID of the user or group to make eligible
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER StartDateTime
        When the eligibility starts (default: now)
    .PARAMETER EndDateTime
        When the eligibility ends (optional, for time-bound)
    .PARAMETER Justification
        Justification for the assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$PrincipalId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [datetime]$StartDateTime = (Get-Date),

        [datetime]$EndDateTime,

        [string]$Justification = "Added via PIMBuddy"
    )

    try {
        Write-PIMBuddyLog -Message "Adding eligible $AccessId to group $GroupId for principal $PrincipalId" -Level "Info"

        if ($PSCmdlet.ShouldProcess($PrincipalId, "Add eligible $AccessId")) {
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
                accessId = $AccessId
                principalId = $PrincipalId
                groupId = $GroupId
                action = "adminAssign"
                scheduleInfo = $scheduleInfo
                justification = $Justification
            }

            $result = New-MgIdentityGovernancePrivilegedAccessGroupEligibilityScheduleRequest -BodyParameter $requestBody

            Write-PIMBuddyLog -Message "Eligible assignment created successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to add eligible assignment" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Add-PIMGroupActiveMember {
    <#
    .SYNOPSIS
        Add an active member assignment to a PIM group
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER PrincipalId
        The ID of the user or group to make active
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER StartDateTime
        When the assignment starts
    .PARAMETER EndDateTime
        When the assignment ends (optional)
    .PARAMETER Justification
        Justification for the assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$PrincipalId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [datetime]$StartDateTime = (Get-Date),

        [datetime]$EndDateTime,

        [string]$Justification = "Added via PIMBuddy"
    )

    try {
        Write-PIMBuddyLog -Message "Adding active $AccessId to group $GroupId for principal $PrincipalId" -Level "Info"

        if ($PSCmdlet.ShouldProcess($PrincipalId, "Add active $AccessId")) {
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
                accessId = $AccessId
                principalId = $PrincipalId
                groupId = $GroupId
                action = "adminAssign"
                scheduleInfo = $scheduleInfo
                justification = $Justification
            }

            $result = New-MgIdentityGovernancePrivilegedAccessGroupAssignmentScheduleRequest -BodyParameter $requestBody

            Write-PIMBuddyLog -Message "Active assignment created successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to add active assignment" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Remove-PIMGroupAssignment {
    <#
    .SYNOPSIS
        Remove a PIM group assignment
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER PrincipalId
        The ID of the principal to remove
    .PARAMETER AccessId
        The type of access (member or owner)
    .PARAMETER AssignmentType
        Whether to remove eligible or active assignment
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$PrincipalId,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member",

        [ValidateSet("eligible", "active")]
        [string]$AssignmentType = "eligible"
    )

    try {
        Write-PIMBuddyLog -Message "Removing $AssignmentType $AccessId from group $GroupId for principal $PrincipalId" -Level "Info"

        if ($PSCmdlet.ShouldProcess($PrincipalId, "Remove $AssignmentType $AccessId")) {
            $requestBody = @{
                accessId = $AccessId
                principalId = $PrincipalId
                groupId = $GroupId
                action = "adminRemove"
            }

            if ($AssignmentType -eq "eligible") {
                $result = New-MgIdentityGovernancePrivilegedAccessGroupEligibilityScheduleRequest -BodyParameter $requestBody
            }
            else {
                $result = New-MgIdentityGovernancePrivilegedAccessGroupAssignmentScheduleRequest -BodyParameter $requestBody
            }

            Write-PIMBuddyLog -Message "Assignment removed successfully" -Level "Success"

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
        Write-PIMBuddyLog -Message "Failed to remove assignment" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Bulk Operations

function Import-PIMGroupAssignments {
    <#
    .SYNOPSIS
        Import PIM group assignments from a CSV file
    .PARAMETER FilePath
        Path to the CSV file
    .PARAMETER GroupId
        The target group ID
    .PARAMETER AssignmentType
        Whether to create eligible or active assignments
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [Parameter(Mandatory)]
        [string]$GroupId,

        [ValidateSet("eligible", "active")]
        [string]$AssignmentType = "eligible"
    )

    try {
        # Import CSV
        $importResult = Import-FromCsv -FilePath $FilePath -RequiredColumns @("UserPrincipalName", "AccessId")
        if (-not $importResult.Success) {
            return $importResult
        }

        $assignments = $importResult.Data
        $results = @{
            Success = $true
            TotalCount = $assignments.Count
            SuccessCount = 0
            FailedCount = 0
            Errors = @()
        }

        foreach ($assignment in $assignments) {
            try {
                # Get user ID from UPN
                $user = Get-MgUser -Filter "userPrincipalName eq '$($assignment.UserPrincipalName)'" -ErrorAction Stop
                if (-not $user) {
                    throw "User not found: $($assignment.UserPrincipalName)"
                }

                $accessId = if ($assignment.AccessId) { $assignment.AccessId.ToLower() } else { "member" }
                $endDate = if ($assignment.EndDateTime) { [datetime]$assignment.EndDateTime } else { $null }

                if ($AssignmentType -eq "eligible") {
                    $addResult = Add-PIMGroupEligibleMember -GroupId $GroupId -PrincipalId $user.Id `
                        -AccessId $accessId -EndDateTime $endDate `
                        -Justification "Imported via PIMBuddy CSV"
                }
                else {
                    $addResult = Add-PIMGroupActiveMember -GroupId $GroupId -PrincipalId $user.Id `
                        -AccessId $accessId -EndDateTime $endDate `
                        -Justification "Imported via PIMBuddy CSV"
                }

                if ($addResult.Success) {
                    $results.SuccessCount++
                }
                else {
                    $results.FailedCount++
                    $results.Errors += "Failed for $($assignment.UserPrincipalName): $($addResult.Error)"
                }
            }
            catch {
                $results.FailedCount++
                $results.Errors += "Failed for $($assignment.UserPrincipalName): $($_.Exception.Message)"
            }
        }

        Write-PIMBuddyLog -Message "Bulk import completed: $($results.SuccessCount) success, $($results.FailedCount) failed" -Level "Info"

        return $results
    }
    catch {
        Write-PIMBuddyLog -Message "Bulk import failed" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Export-PIMGroupAssignments {
    <#
    .SYNOPSIS
        Export PIM group assignments to a CSV file
    .PARAMETER GroupId
        The group ID to export assignments from
    .PARAMETER FilePath
        Path to save the CSV file
    .PARAMETER AssignmentType
        Which assignments to export (eligible, active, or all)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$FilePath,

        [ValidateSet("eligible", "active", "all")]
        [string]$AssignmentType = "all"
    )

    try {
        $groupDetails = Get-PIMGroupDetails -GroupId $GroupId
        if (-not $groupDetails.Success) {
            return $groupDetails
        }

        $exportData = @()

        if ($AssignmentType -in @("eligible", "all")) {
            foreach ($assignment in $groupDetails.EligibleAssignments) {
                $exportData += [PSCustomObject]@{
                    GroupName = $groupDetails.Group.DisplayName
                    GroupId = $GroupId
                    PrincipalName = $assignment.PrincipalName
                    PrincipalId = $assignment.PrincipalId
                    AccessId = $assignment.AccessId
                    AssignmentType = "Eligible"
                    StartDateTime = $assignment.StartDateTime
                    EndDateTime = $assignment.EndDateTime
                    Status = $assignment.Status
                }
            }
        }

        if ($AssignmentType -in @("active", "all")) {
            foreach ($assignment in $groupDetails.ActiveAssignments) {
                $exportData += [PSCustomObject]@{
                    GroupName = $groupDetails.Group.DisplayName
                    GroupId = $GroupId
                    PrincipalName = $assignment.PrincipalName
                    PrincipalId = $assignment.PrincipalId
                    AccessId = $assignment.AccessId
                    AssignmentType = "Active"
                    StartDateTime = $assignment.StartDateTime
                    EndDateTime = $assignment.EndDateTime
                    Status = $assignment.Status
                }
            }
        }

        $success = Export-ToCsv -Data $exportData -FilePath $FilePath

        return @{
            Success = $success
            ExportedCount = $exportData.Count
            FilePath = $FilePath
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Export failed" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Statistics

function Get-PIMGroupStatistics {
    <#
    .SYNOPSIS
        Get statistics about PIM groups and assignments
    #>
    [CmdletBinding()]
    param()

    try {
        $groupsResult = Get-PIMGroups -IncludeMemberCount

        $stats = @{
            TotalGroups = 0
            TotalEligibleAssignments = 0
            TotalActiveAssignments = 0
            PendingRequests = 0
        }

        if ($groupsResult.Success) {
            $stats.TotalGroups = $groupsResult.Count

            foreach ($group in $groupsResult.Groups) {
                # Get assignments for each group
                try {
                    $eligible = Get-MgIdentityGovernancePrivilegedAccessGroupEligibilitySchedule -Filter "groupId eq '$($group.Id)'" -All
                    $active = Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentSchedule -Filter "groupId eq '$($group.Id)'" -All

                    $stats.TotalEligibleAssignments += $eligible.Count
                    $stats.TotalActiveAssignments += $active.Count
                }
                catch {
                    # Continue if we can't get assignments for a specific group
                }
            }

            # Get pending requests
            try {
                $pendingEligible = Get-MgIdentityGovernancePrivilegedAccessGroupEligibilityScheduleRequest -Filter "status eq 'PendingApproval'" -All
                $pendingActive = Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentScheduleRequest -Filter "status eq 'PendingApproval'" -All
                $stats.PendingRequests = $pendingEligible.Count + $pendingActive.Count
            }
            catch {
                # Ignore if we can't get pending requests
            }
        }

        return @{
            Success = $true
            Statistics = $stats
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get statistics" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region User Search

function Search-Users {
    <#
    .SYNOPSIS
        Search for users by name or UPN
    .PARAMETER SearchString
        The search string
    .PARAMETER MaxResults
        Maximum number of results to return
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$SearchString,

        [int]$MaxResults = 20
    )

    try {
        $filter = "startswith(displayName, '$SearchString') or startswith(userPrincipalName, '$SearchString')"
        $users = Get-MgUser -Filter $filter -Top $MaxResults -Property "Id,DisplayName,UserPrincipalName,Mail,JobTitle"

        return @{
            Success = $true
            Users = $users | ForEach-Object {
                [PSCustomObject]@{
                    Id = $_.Id
                    DisplayName = $_.DisplayName
                    UserPrincipalName = $_.UserPrincipalName
                    Email = $_.Mail
                    JobTitle = $_.JobTitle
                }
            }
        }
    }
    catch {
        Write-PIMBuddyLog -Message "User search failed" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Users = @()
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

# Export all functions
Export-ModuleMember -Function *
