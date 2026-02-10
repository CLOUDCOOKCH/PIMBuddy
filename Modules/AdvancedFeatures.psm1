<#
.SYNOPSIS
    PIMBuddy Advanced Features Module
.DESCRIPTION
    Connection health monitoring, policy comparison, compliance checking,
    audit trail, and other advanced features for PIMBuddy
#>

#region Connection Health Monitoring

$script:LastConnectionCheck = $null
$script:ConnectionCheckInterval = 60  # seconds
$script:TokenExpiryBuffer = 300  # 5 minutes before expiry

function Test-GraphConnection {
    <#
    .SYNOPSIS
        Test if the Graph connection is still valid
    .PARAMETER Quick
        Do a quick check without making an API call
    #>
    [CmdletBinding()]
    param(
        [switch]$Quick
    )

    try {
        $context = Get-MgContext

        if (-not $context) {
            return @{
                Connected = $false
                Reason = "No active connection"
                NeedsReconnect = $true
            }
        }

        # Check if token is about to expire
        if ($context.TokenCredentialType -eq "InteractiveBrowserCredential") {
            # For interactive auth, we can't easily check expiry
            # Do a quick API call to verify
            if (-not $Quick) {
                try {
                    $null = Get-MgOrganization -Top 1 -ErrorAction Stop
                }
                catch {
                    if ($_.Exception.Message -match "token|expired|unauthorized|authentication") {
                        return @{
                            Connected = $false
                            Reason = "Token expired or invalid"
                            NeedsReconnect = $true
                        }
                    }
                }
            }
        }

        $script:LastConnectionCheck = Get-Date

        return @{
            Connected = $true
            TenantId = $context.TenantId
            Account = $context.Account
            Scopes = $context.Scopes
            LastChecked = $script:LastConnectionCheck
        }
    }
    catch {
        return @{
            Connected = $false
            Reason = $_.Exception.Message
            NeedsReconnect = $true
        }
    }
}

function Invoke-WithConnectionCheck {
    <#
    .SYNOPSIS
        Execute a script block with automatic connection validation
    .PARAMETER ScriptBlock
        The code to execute
    .PARAMETER RetryOnFailure
        Automatically retry after reconnecting
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [scriptblock]$ScriptBlock,

        [switch]$RetryOnFailure
    )

    # Check connection first
    $connectionStatus = Test-GraphConnection -Quick

    if (-not $connectionStatus.Connected) {
        Write-PIMBuddyLog -Message "Connection check failed: $($connectionStatus.Reason)" -Level "Warning"

        if ($RetryOnFailure) {
            Write-PIMBuddyLog -Message "Attempting to reconnect..." -Level "Info"
            # Trigger reconnection
            return @{
                Success = $false
                NeedsReconnect = $true
                Error = $connectionStatus.Reason
            }
        }

        throw "Not connected to Microsoft Graph: $($connectionStatus.Reason)"
    }

    try {
        return & $ScriptBlock
    }
    catch {
        if ($_.Exception.Message -match "token|expired|unauthorized|authentication") {
            Write-PIMBuddyLog -Message "Authentication error during operation" -Level "Warning"
            return @{
                Success = $false
                NeedsReconnect = $true
                Error = "Session expired. Please reconnect."
            }
        }
        throw
    }
}

#endregion

#region Policy Comparison

function Compare-PIMPolicies {
    <#
    .SYNOPSIS
        Compare two PIM policies and return differences
    .PARAMETER Policy1
        First policy settings object
    .PARAMETER Policy2
        Second policy settings object
    .PARAMETER Policy1Name
        Display name for first policy
    .PARAMETER Policy2Name
        Display name for second policy
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        $Policy1,

        [Parameter(Mandatory)]
        $Policy2,

        [string]$Policy1Name = "Policy 1",
        [string]$Policy2Name = "Policy 2"
    )

    $differences = @()

    # Compare Activation settings
    $activationProps = @(
        @{ Name = "Maximum Duration (Hours)"; Path = "Activation.MaximumDurationHours" }
        @{ Name = "Require MFA"; Path = "Activation.RequireMfa" }
        @{ Name = "Require Justification"; Path = "Activation.RequireJustification" }
        @{ Name = "Require Ticket Info"; Path = "Activation.RequireTicketInfo" }
        @{ Name = "Require Approval"; Path = "Activation.RequireApproval" }
    )

    foreach ($prop in $activationProps) {
        $val1 = Get-NestedProperty -Object $Policy1 -Path $prop.Path
        $val2 = Get-NestedProperty -Object $Policy2 -Path $prop.Path

        if ($val1 -ne $val2) {
            $differences += [PSCustomObject]@{
                Category = "Activation"
                Setting = $prop.Name
                "$Policy1Name" = $val1
                "$Policy2Name" = $val2
                IsDifferent = $true
            }
        }
    }

    # Compare Eligible Assignment settings
    $eligibleProps = @(
        @{ Name = "Allow Permanent"; Path = "EligibleAssignment.AllowPermanent" }
        @{ Name = "Maximum Duration (Days)"; Path = "EligibleAssignment.MaximumDurationDays" }
    )

    foreach ($prop in $eligibleProps) {
        $val1 = Get-NestedProperty -Object $Policy1 -Path $prop.Path
        $val2 = Get-NestedProperty -Object $Policy2 -Path $prop.Path

        if ($val1 -ne $val2) {
            $differences += [PSCustomObject]@{
                Category = "Eligible Assignment"
                Setting = $prop.Name
                "$Policy1Name" = $val1
                "$Policy2Name" = $val2
                IsDifferent = $true
            }
        }
    }

    # Compare Active Assignment settings
    $activeProps = @(
        @{ Name = "Allow Permanent"; Path = "ActiveAssignment.AllowPermanent" }
        @{ Name = "Maximum Duration (Days)"; Path = "ActiveAssignment.MaximumDurationDays" }
        @{ Name = "Require MFA"; Path = "ActiveAssignment.RequireMfa" }
        @{ Name = "Require Justification"; Path = "ActiveAssignment.RequireJustification" }
    )

    foreach ($prop in $activeProps) {
        $val1 = Get-NestedProperty -Object $Policy1 -Path $prop.Path
        $val2 = Get-NestedProperty -Object $Policy2 -Path $prop.Path

        if ($val1 -ne $val2) {
            $differences += [PSCustomObject]@{
                Category = "Active Assignment"
                Setting = $prop.Name
                "$Policy1Name" = $val1
                "$Policy2Name" = $val2
                IsDifferent = $true
            }
        }
    }

    return @{
        HasDifferences = $differences.Count -gt 0
        DifferenceCount = $differences.Count
        Differences = $differences
        Policy1Name = $Policy1Name
        Policy2Name = $Policy2Name
    }
}

function Get-NestedProperty {
    param($Object, [string]$Path)

    $parts = $Path.Split('.')
    $current = $Object

    foreach ($part in $parts) {
        if ($null -eq $current) { return $null }
        $current = $current.$part
    }

    return $current
}

#endregion

#region Undo/Rollback System

$script:PolicyHistory = @{}
$script:MaxHistoryItems = 20

function Save-PolicyState {
    <#
    .SYNOPSIS
        Save the current state of a policy for potential rollback
    .PARAMETER TargetId
        The ID of the group or role
    .PARAMETER TargetType
        Whether this is a Group or Role policy
    .PARAMETER PolicySettings
        The current policy settings to save
    .PARAMETER ChangeDescription
        Description of what change is about to be made
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TargetId,

        [ValidateSet("Group", "Role")]
        [string]$TargetType = "Group",

        [Parameter(Mandatory)]
        $PolicySettings,

        [string]$ChangeDescription = "Policy change"
    )

    $key = "${TargetType}_${TargetId}"

    if (-not $script:PolicyHistory.ContainsKey($key)) {
        $script:PolicyHistory[$key] = @()
    }

    $historyEntry = @{
        Timestamp = Get-Date
        Settings = $PolicySettings | ConvertTo-Json -Depth 10 | ConvertFrom-Json  # Deep copy
        Description = $ChangeDescription
        User = (Get-MgContext).Account
    }

    # Add to beginning of array
    $script:PolicyHistory[$key] = @($historyEntry) + $script:PolicyHistory[$key]

    # Trim to max items
    if ($script:PolicyHistory[$key].Count -gt $script:MaxHistoryItems) {
        $script:PolicyHistory[$key] = $script:PolicyHistory[$key][0..($script:MaxHistoryItems - 1)]
    }

    Write-PIMBuddyLog -Message "Saved policy state for $TargetType $TargetId" -Level "Debug"

    return $historyEntry
}

function Get-PolicyHistory {
    <#
    .SYNOPSIS
        Get the change history for a policy
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TargetId,

        [ValidateSet("Group", "Role")]
        [string]$TargetType = "Group",

        [int]$Last = 10
    )

    $key = "${TargetType}_${TargetId}"

    if (-not $script:PolicyHistory.ContainsKey($key)) {
        return @()
    }

    return $script:PolicyHistory[$key] | Select-Object -First $Last
}

function Restore-PolicyState {
    <#
    .SYNOPSIS
        Restore a policy to a previous state
    .PARAMETER TargetId
        The ID of the group or role
    .PARAMETER TargetType
        Whether this is a Group or Role policy
    .PARAMETER HistoryIndex
        Which history entry to restore (0 = most recent)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TargetId,

        [ValidateSet("Group", "Role")]
        [string]$TargetType = "Group",

        [int]$HistoryIndex = 0
    )

    $history = Get-PolicyHistory -TargetId $TargetId -TargetType $TargetType

    if ($history.Count -eq 0 -or $HistoryIndex -ge $history.Count) {
        return @{
            Success = $false
            Error = "No history entry found at index $HistoryIndex"
        }
    }

    $stateToRestore = $history[$HistoryIndex]

    Write-PIMBuddyLog -Message "Restoring policy state from $($stateToRestore.Timestamp)" -Level "Info"

    # The actual restoration would need to call the appropriate Set-* functions
    # This returns the settings to restore
    return @{
        Success = $true
        Settings = $stateToRestore.Settings
        Timestamp = $stateToRestore.Timestamp
        Description = $stateToRestore.Description
    }
}

#endregion

#region Compliance Checking

$script:ComplianceRules = @{
    HighPrivilegeRoles = @(
        "Global Administrator",
        "Privileged Role Administrator",
        "Privileged Authentication Administrator",
        "Security Administrator",
        "Exchange Administrator",
        "SharePoint Administrator"
    )

    CriticalRoles = @(
        "Global Administrator",
        "Privileged Role Administrator"
    )

    BestPractices = @{
        MaxActivationDurationHours = 8
        RequireMfaForHighPrivilege = $true
        RequireApprovalForCritical = $true
        RequireJustification = $true
        DisallowPermanentActiveAssignment = $true
        MaxEligibleDurationDays = 365
    }
}

function Test-PolicyCompliance {
    <#
    .SYNOPSIS
        Check a policy against best practices
    .PARAMETER PolicySettings
        The policy settings to check
    .PARAMETER RoleName
        The name of the role (to determine if it's high-privilege)
    .PARAMETER TargetType
        Whether this is a Group or Role policy
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        $PolicySettings,

        [string]$RoleName = "",

        [ValidateSet("Group", "Role")]
        [string]$TargetType = "Group"
    )

    $findings = @()
    $score = 100
    $isHighPrivilege = $RoleName -in $script:ComplianceRules.HighPrivilegeRoles
    $isCritical = $RoleName -in $script:ComplianceRules.CriticalRoles

    # Check activation duration
    $maxDuration = $PolicySettings.Activation.MaximumDurationHours
    if ($maxDuration -gt $script:ComplianceRules.BestPractices.MaxActivationDurationHours) {
        $severity = if ($isHighPrivilege) { "High" } else { "Medium" }
        $findings += [PSCustomObject]@{
            Category = "Activation"
            Finding = "Activation duration ($maxDuration hours) exceeds recommended maximum ($($script:ComplianceRules.BestPractices.MaxActivationDurationHours) hours)"
            Severity = $severity
            Recommendation = "Reduce maximum activation duration to 8 hours or less"
            CurrentValue = $maxDuration
            RecommendedValue = $script:ComplianceRules.BestPractices.MaxActivationDurationHours
        }
        $score -= if ($severity -eq "High") { 15 } else { 10 }
    }

    # Check MFA requirement
    if (-not $PolicySettings.Activation.RequireMfa) {
        $severity = if ($isHighPrivilege) { "Critical" } else { "High" }
        $findings += [PSCustomObject]@{
            Category = "Authentication"
            Finding = "MFA is not required for activation"
            Severity = $severity
            Recommendation = "Enable MFA requirement for all PIM activations"
            CurrentValue = $false
            RecommendedValue = $true
        }
        $score -= if ($severity -eq "Critical") { 25 } else { 15 }
    }

    # Check approval requirement for critical roles
    if ($isCritical -and -not $PolicySettings.Activation.RequireApproval) {
        $findings += [PSCustomObject]@{
            Category = "Approval"
            Finding = "Approval is not required for critical role activation"
            Severity = "Critical"
            Recommendation = "Enable approval requirement for Global Administrator and Privileged Role Administrator"
            CurrentValue = $false
            RecommendedValue = $true
        }
        $score -= 20
    }

    # Check justification requirement
    if (-not $PolicySettings.Activation.RequireJustification) {
        $findings += [PSCustomObject]@{
            Category = "Accountability"
            Finding = "Justification is not required for activation"
            Severity = "Medium"
            Recommendation = "Enable justification requirement to maintain audit trail"
            CurrentValue = $false
            RecommendedValue = $true
        }
        $score -= 10
    }

    # Check permanent active assignments
    if ($PolicySettings.ActiveAssignment.AllowPermanent) {
        $severity = if ($isHighPrivilege) { "High" } else { "Medium" }
        $findings += [PSCustomObject]@{
            Category = "Assignment"
            Finding = "Permanent active assignments are allowed"
            Severity = $severity
            Recommendation = "Disable permanent active assignments to enforce just-in-time access"
            CurrentValue = $true
            RecommendedValue = $false
        }
        $score -= if ($severity -eq "High") { 15 } else { 10 }
    }

    # Determine overall status
    $status = switch ($score) {
        { $_ -ge 90 } { "Compliant" }
        { $_ -ge 70 } { "Partially Compliant" }
        { $_ -ge 50 } { "Needs Improvement" }
        default { "Non-Compliant" }
    }

    return @{
        Score = [Math]::Max(0, $score)
        Status = $status
        Findings = $findings
        FindingCount = $findings.Count
        CriticalCount = ($findings | Where-Object { $_.Severity -eq "Critical" }).Count
        HighCount = ($findings | Where-Object { $_.Severity -eq "High" }).Count
        MediumCount = ($findings | Where-Object { $_.Severity -eq "Medium" }).Count
        IsHighPrivilegeRole = $isHighPrivilege
        IsCriticalRole = $isCritical
    }
}

function Get-TenantComplianceReport {
    <#
    .SYNOPSIS
        Generate a compliance report for all PIM groups
    #>
    [CmdletBinding()]
    param()

    try {
        # PERFORMANCE: Use List<T> for Groups instead of array +=
        $groupsList = [System.Collections.Generic.List[PSCustomObject]]::new()

        $report = @{
            GeneratedAt = Get-Date
            Groups = $null  # Will be set from list at the end
            Summary = @{
                TotalGroups = 0
                CompliantCount = 0
                PartiallyCompliantCount = 0
                NonCompliantCount = 0
                AverageScore = 0
                CriticalFindingsTotal = 0
            }
        }

        # Get all PIM groups
        $groupsResult = Get-PIMGroups
        if (-not $groupsResult.Success) {
            return @{
                Success = $false
                Error = "Failed to get groups: $($groupsResult.Error)"
            }
        }

        $totalScore = 0

        foreach ($group in $groupsResult.Groups) {
            $policyResult = Get-PIMGroupPolicy -GroupId $group.Id -AccessId "member"

            if ($policyResult.Success -and -not $policyResult.IsDefault) {
                $compliance = Test-PolicyCompliance -PolicySettings $policyResult.Settings -TargetType "Group"

                $groupsList.Add([PSCustomObject]@{
                    GroupId = $group.Id
                    GroupName = $group.DisplayName
                    Score = $compliance.Score
                    Status = $compliance.Status
                    Findings = $compliance.Findings
                    CriticalCount = $compliance.CriticalCount
                })

                $totalScore += $compliance.Score
                $report.Summary.TotalGroups++
                $report.Summary.CriticalFindingsTotal += $compliance.CriticalCount

                switch ($compliance.Status) {
                    "Compliant" { $report.Summary.CompliantCount++ }
                    "Partially Compliant" { $report.Summary.PartiallyCompliantCount++ }
                    default { $report.Summary.NonCompliantCount++ }
                }
            }
        }

        # Convert list to array for output
        $report.Groups = @($groupsList)

        if ($report.Summary.TotalGroups -gt 0) {
            $report.Summary.AverageScore = [Math]::Round($totalScore / $report.Summary.TotalGroups, 1)
        }

        return @{
            Success = $true
            Report = $report
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to generate compliance report" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

#endregion

#region Audit Trail

$script:AuditLogPath = $null
$script:AuditLog = @()
$script:MaxAuditEntries = 1000

function Initialize-AuditLog {
    <#
    .SYNOPSIS
        Initialize the audit log system
    #>
    [CmdletBinding()]
    param(
        [string]$LogDirectory
    )

    # Always ensure audit log is initialized to empty array first
    $script:AuditLog = @()

    try {
        if (-not $LogDirectory) {
            $LogDirectory = Join-Path $PSScriptRoot "..\Logs"
        }

        if (-not (Test-Path $LogDirectory)) {
            New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
        }

        $script:AuditLogPath = Join-Path $LogDirectory "PIMBuddy_Audit.json"

        # Load existing audit log
        if (Test-Path $script:AuditLogPath) {
            try {
                $content = Get-Content $script:AuditLogPath -Raw -ErrorAction SilentlyContinue
                if ($content) {
                    $parsed = $content | ConvertFrom-Json -ErrorAction SilentlyContinue
                    if ($parsed) {
                        $script:AuditLog = @($parsed)
                    }
                }
            }
            catch {
                $script:AuditLog = @()
            }
        }

        # Only log if Write-PIMBuddyLog is available
        if (Get-Command -Name Write-PIMBuddyLog -ErrorAction SilentlyContinue) {
            Write-PIMBuddyLog -Message "Audit log initialized: $($script:AuditLogPath)" -Level "Debug"
        }
    }
    catch {
        # Ensure audit log is always an array even on error
        $script:AuditLog = @()
    }
}

function Write-AuditEntry {
    <#
    .SYNOPSIS
        Write an entry to the audit log
    .PARAMETER Action
        The action performed (Create, Update, Delete, etc.)
    .PARAMETER TargetType
        The type of object affected (Group, Role, Policy, etc.)
    .PARAMETER TargetId
        The ID of the affected object
    .PARAMETER TargetName
        The display name of the affected object
    .PARAMETER Details
        Additional details about the change
    .PARAMETER BeforeState
        The state before the change (optional)
    .PARAMETER AfterState
        The state after the change (optional)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateSet("Create", "Update", "Delete", "Apply", "Export", "Import", "Connect", "Disconnect")]
        [string]$Action,

        [Parameter(Mandatory)]
        [string]$TargetType,

        [string]$TargetId,
        [string]$TargetName,
        [string]$Details,
        $BeforeState,
        $AfterState
    )

    $context = Get-MgContext

    $entry = [PSCustomObject]@{
        Timestamp = (Get-Date).ToString("o")
        Action = $Action
        TargetType = $TargetType
        TargetId = $TargetId
        TargetName = $TargetName
        Details = $Details
        User = if ($context) { $context.Account } else { "Unknown" }
        TenantId = if ($context) { $context.TenantId } else { "Unknown" }
        BeforeState = $BeforeState
        AfterState = $AfterState
        ComputerName = $env:COMPUTERNAME
    }

    $script:AuditLog = @($entry) + $script:AuditLog

    # Trim to max entries
    if ($script:AuditLog.Count -gt $script:MaxAuditEntries) {
        $script:AuditLog = $script:AuditLog[0..($script:MaxAuditEntries - 1)]
    }

    # Save to file
    Save-AuditLog

    Write-PIMBuddyLog -Message "Audit: $Action $TargetType '$TargetName'" -Level "Debug"

    return $entry
}

function Save-AuditLog {
    if ($script:AuditLogPath) {
        try {
            $script:AuditLog | ConvertTo-Json -Depth 10 | Set-Content -Path $script:AuditLogPath -Encoding UTF8
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to save audit log: $($_.Exception.Message)" -Level "Warning"
        }
    }
}

function Get-AuditLog {
    <#
    .SYNOPSIS
        Get audit log entries
    .PARAMETER Last
        Number of entries to return
    .PARAMETER TargetType
        Filter by target type
    .PARAMETER Action
        Filter by action
    .PARAMETER StartDate
        Filter by start date
    .PARAMETER EndDate
        Filter by end date
    #>
    [CmdletBinding()]
    param(
        [int]$Last = 100,
        [string]$TargetType,
        [string]$Action,
        [datetime]$StartDate,
        [datetime]$EndDate
    )

    # Ensure we have an array, not null
    if ($null -eq $script:AuditLog) {
        $script:AuditLog = @()
    }

    $entries = @($script:AuditLog)

    if ($TargetType -and $entries.Count -gt 0) {
        $entries = @($entries | Where-Object { $_.TargetType -eq $TargetType })
    }

    if ($Action -and $entries.Count -gt 0) {
        $entries = @($entries | Where-Object { $_.Action -eq $Action })
    }

    if ($StartDate -and $entries.Count -gt 0) {
        $entries = @($entries | Where-Object { [datetime]$_.Timestamp -ge $StartDate })
    }

    if ($EndDate -and $entries.Count -gt 0) {
        $entries = @($entries | Where-Object { [datetime]$_.Timestamp -le $EndDate })
    }

    if ($entries.Count -eq 0) {
        return @()
    }

    return @($entries | Select-Object -First $Last)
}

function Export-AuditReport {
    <#
    .SYNOPSIS
        Export audit log to a file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [ValidateSet("JSON", "CSV")]
        [string]$Format = "JSON",

        [datetime]$StartDate,
        [datetime]$EndDate
    )

    $entries = Get-AuditLog -Last 10000 -StartDate $StartDate -EndDate $EndDate

    if ($Format -eq "JSON") {
        $entries | ConvertTo-Json -Depth 10 | Set-Content -Path $FilePath -Encoding UTF8
    }
    else {
        $entries | Select-Object Timestamp, Action, TargetType, TargetId, TargetName, User, Details |
            Export-Csv -Path $FilePath -NoTypeInformation -Encoding UTF8
    }

    return @{
        Success = $true
        FilePath = $FilePath
        EntryCount = $entries.Count
    }
}

#endregion

#region Copy Policy

function Copy-PIMPolicy {
    <#
    .SYNOPSIS
        Copy policy settings from one group to another
    .PARAMETER SourceGroupId
        The ID of the source group
    .PARAMETER TargetGroupId
        The ID of the target group
    .PARAMETER IncludeActivation
        Copy activation settings
    .PARAMETER IncludeAssignment
        Copy assignment settings
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$SourceGroupId,

        [Parameter(Mandatory)]
        [string]$TargetGroupId,

        [switch]$IncludeActivation = $true,
        [switch]$IncludeAssignment = $true
    )

    try {
        Write-PIMBuddyLog -Message "Copying policy from $SourceGroupId to $TargetGroupId" -Level "Info"

        # Get source policy
        $sourcePolicy = Get-PIMGroupPolicy -GroupId $SourceGroupId -AccessId "member"
        if (-not $sourcePolicy.Success) {
            return @{
                Success = $false
                Error = "Failed to get source policy: $($sourcePolicy.Error)"
            }
        }

        # Get target policy for backup
        $targetPolicy = Get-PIMGroupPolicy -GroupId $TargetGroupId -AccessId "member"
        if ($targetPolicy.Success -and -not $targetPolicy.IsDefault) {
            # Save current state for rollback
            Save-PolicyState -TargetId $TargetGroupId -TargetType "Group" -PolicySettings $targetPolicy.Settings -ChangeDescription "Before policy copy from $SourceGroupId"
        }

        $results = @{
            ActivationResult = $null
            AssignmentResult = $null
        }

        # Copy activation settings
        if ($IncludeActivation) {
            $activationParams = @{
                GroupId = $TargetGroupId
                AccessId = "member"
                MaximumDurationHours = $sourcePolicy.Settings.Activation.MaximumDurationHours
                RequireMfa = $sourcePolicy.Settings.Activation.RequireMfa
                RequireJustification = $sourcePolicy.Settings.Activation.RequireJustification
                RequireTicketInfo = $sourcePolicy.Settings.Activation.RequireTicketInfo
                RequireApproval = $sourcePolicy.Settings.Activation.RequireApproval
                Confirm = $false
            }
            $results.ActivationResult = Set-PIMGroupActivationSettings @activationParams
        }

        # Copy assignment settings
        if ($IncludeAssignment) {
            $eligibleParams = @{
                GroupId = $TargetGroupId
                AccessId = "member"
                AssignmentType = "eligible"
                AllowPermanent = $sourcePolicy.Settings.EligibleAssignment.AllowPermanent
                Confirm = $false
            }
            if ($sourcePolicy.Settings.EligibleAssignment.MaximumDurationDays) {
                $eligibleParams.MaximumDurationDays = $sourcePolicy.Settings.EligibleAssignment.MaximumDurationDays
            }
            $results.EligibleResult = Set-PIMGroupAssignmentSettings @eligibleParams

            $activeParams = @{
                GroupId = $TargetGroupId
                AccessId = "member"
                AssignmentType = "active"
                AllowPermanent = $sourcePolicy.Settings.ActiveAssignment.AllowPermanent
                RequireMfa = $sourcePolicy.Settings.ActiveAssignment.RequireMfa
                RequireJustification = $sourcePolicy.Settings.ActiveAssignment.RequireJustification
                Confirm = $false
            }
            if ($sourcePolicy.Settings.ActiveAssignment.MaximumDurationDays) {
                $activeParams.MaximumDurationDays = $sourcePolicy.Settings.ActiveAssignment.MaximumDurationDays
            }
            $results.ActiveResult = Set-PIMGroupAssignmentSettings @activeParams
        }

        # Write audit entry
        Write-AuditEntry -Action "Apply" -TargetType "Policy" -TargetId $TargetGroupId -TargetName "Policy Copy" -Details "Copied from $SourceGroupId"

        $success = (-not $results.ActivationResult -or $results.ActivationResult.Success) -and
                   (-not $results.EligibleResult -or $results.EligibleResult.Success) -and
                   (-not $results.ActiveResult -or $results.ActiveResult.Success)

        return @{
            Success = $success
            Results = $results
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to copy policy" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

#endregion

#region Template Import/Export

function Export-TemplateToFile {
    <#
    .SYNOPSIS
        Export a template to a shareable file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId,

        [Parameter(Mandatory)]
        [string]$FilePath
    )

    try {
        $templatesResult = Get-PIMTemplates
        if (-not $templatesResult.Success) {
            return @{ Success = $false; Error = "Failed to load templates" }
        }

        $template = $templatesResult.Templates | Where-Object { $_.Id -eq $TemplateId } | Select-Object -First 1
        if (-not $template) {
            return @{ Success = $false; Error = "Template not found: $TemplateId" }
        }

        $exportData = @{
            version = "1.0"
            exportedAt = (Get-Date).ToString("o")
            exportedBy = (Get-MgContext).Account
            template = @{
                id = $template.Id
                name = $template.Name
                description = $template.Description
                icon = $template.Icon
                tiers = $template.Tiers
            }
        }

        $exportData | ConvertTo-Json -Depth 20 | Set-Content -Path $FilePath -Encoding UTF8

        return @{
            Success = $true
            FilePath = $FilePath
            TemplateName = $template.Name
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Import-TemplateFromFile {
    <#
    .SYNOPSIS
        Import a template from a file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [string]$NewName
    )

    try {
        if (-not (Test-Path $FilePath)) {
            return @{ Success = $false; Error = "File not found: $FilePath" }
        }

        $importData = Get-Content $FilePath -Raw | ConvertFrom-Json

        if (-not $importData.template) {
            return @{ Success = $false; Error = "Invalid template file format" }
        }

        $template = $importData.template
        $templateName = if ($NewName) { $NewName } else { $template.name + " (Imported)" }

        # Extract settings from first tier
        $tier = $template.tiers | Select-Object -First 1
        if (-not $tier -or -not $tier.settings) {
            return @{ Success = $false; Error = "Template has no settings" }
        }

        $settings = @{
            MaximumDurationHours = $tier.settings.activation.maximumDurationHours
            RequireMfa = $tier.settings.activation.requireMfa
            RequireJustification = $tier.settings.activation.requireJustification
            RequireTicketInfo = $tier.settings.activation.requireTicketInfo
            RequireApproval = $tier.settings.activation.requireApproval
            AllowPermanentEligible = $tier.settings.eligibleAssignment.allowPermanent
            EligibleDurationDays = $tier.settings.eligibleAssignment.maximumDurationDays
            AllowPermanentActive = $tier.settings.activeAssignment.allowPermanent
            ActiveDurationDays = $tier.settings.activeAssignment.maximumDurationDays
        }

        $result = New-PIMCustomTemplate -Name $templateName -Description $template.description -Settings $settings

        if ($result.Success) {
            Write-AuditEntry -Action "Import" -TargetType "Template" -TargetName $templateName -Details "Imported from $FilePath"
        }

        return $result
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

#endregion

# Initialize audit log on module load
Initialize-AuditLog

# Export functions
Export-ModuleMember -Function @(
    'Test-GraphConnection',
    'Invoke-WithConnectionCheck',
    'Compare-PIMPolicies',
    'Save-PolicyState',
    'Get-PolicyHistory',
    'Restore-PolicyState',
    'Test-PolicyCompliance',
    'Get-TenantComplianceReport',
    'Initialize-AuditLog',
    'Write-AuditEntry',
    'Get-AuditLog',
    'Export-AuditReport',
    'Copy-PIMPolicy',
    'Export-TemplateToFile',
    'Import-TemplateFromFile'
)
