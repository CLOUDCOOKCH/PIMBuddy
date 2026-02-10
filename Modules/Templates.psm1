<#
.SYNOPSIS
    PIMBuddy Templates Module
.DESCRIPTION
    Functions for loading and applying PIM policy templates
#>

# Script-level variables
$script:TemplatesPath = Join-Path $PSScriptRoot "..\Config\Templates.json"
$script:CustomTemplatesPath = Join-Path $PSScriptRoot "..\Config\CustomTemplates.json"
$script:LoadedTemplates = $null
$script:CustomTemplates = $null

# Safe logging function that handles case when Write-PIMBuddyLog isn't available yet
function Write-TemplateLog {
    param([string]$Message, [string]$Level = "Info")
    if (Get-Command -Name Write-PIMBuddyLog -ErrorAction SilentlyContinue) {
        Write-PIMBuddyLog -Message $Message -Level $Level
    }
    else {
        Write-Verbose "[$Level] $Message"
    }
}

#region Template Loading

function Get-PIMTemplates {
    <#
    .SYNOPSIS
        Get all available PIM policy templates (built-in and custom)
    .PARAMETER Refresh
        Force reload from file
    .PARAMETER CustomOnly
        Only return custom templates
    .PARAMETER BuiltInOnly
        Only return built-in templates
    #>
    [CmdletBinding()]
    param(
        [switch]$Refresh,
        [switch]$CustomOnly,
        [switch]$BuiltInOnly
    )

    try {
        if ($script:LoadedTemplates -and $script:CustomTemplates -and -not $Refresh) {
            $templates = @()
            if (-not $CustomOnly) { $templates += $script:LoadedTemplates }
            if (-not $BuiltInOnly) { $templates += $script:CustomTemplates }
            return @{
                Success = $true
                Templates = $templates
            }
        }

        $allTemplates = @()

        # Load built-in templates
        if (-not $CustomOnly) {
            if (Test-Path $script:TemplatesPath) {
                $templatesData = Get-Content $script:TemplatesPath -Raw | ConvertFrom-Json

                $script:LoadedTemplates = @($templatesData.templates | ForEach-Object {
                    [PSCustomObject]@{
                        Id = $_.id
                        Name = $_.name
                        Description = $_.description
                        Icon = $_.icon
                        Warning = $_.warning
                        Tiers = $_.tiers
                        TierCount = if ($_.tiers) { $_.tiers.Count } else { 0 }
                        IsCustom = $false
                    }
                })
                $allTemplates += $script:LoadedTemplates
                Write-TemplateLog -Message "Loaded $($script:LoadedTemplates.Count) built-in templates" -Level "Debug"
            }
            else {
                Write-TemplateLog -Message "Built-in templates file not found: $($script:TemplatesPath)" -Level "Warning"
                $script:LoadedTemplates = @()
            }
        }

        # Load custom templates
        if (-not $BuiltInOnly) {
            $script:CustomTemplates = @()
            if (Test-Path $script:CustomTemplatesPath) {
                try {
                    $customData = Get-Content $script:CustomTemplatesPath -Raw | ConvertFrom-Json

                    $script:CustomTemplates = @($customData.templates | ForEach-Object {
                        [PSCustomObject]@{
                            Id = $_.id
                            Name = $_.name
                            Description = $_.description
                            Icon = if ($_.icon) { $_.icon } else { "" }
                            Warning = $_.warning
                            Tiers = $_.tiers
                            TierCount = if ($_.tiers) { $_.tiers.Count } else { 0 }
                            IsCustom = $true
                        }
                    })
                    Write-TemplateLog -Message "Loaded $($script:CustomTemplates.Count) custom templates" -Level "Debug"
                }
                catch {
                    Write-TemplateLog -Message "Error loading custom templates: $($_.Exception.Message)" -Level "Warning"
                }
            }
            $allTemplates += $script:CustomTemplates
        }

        return @{
            Success = $true
            Templates = $allTemplates
            BuiltInCount = $script:LoadedTemplates.Count
            CustomCount = $script:CustomTemplates.Count
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-TemplateLog -Message "Failed to load templates: $errorMsg" -Level "Error"
        return @{
            Success = $false
            Error = $errorMsg
            Templates = @()
        }
    }
}

function Get-PIMTemplate {
    <#
    .SYNOPSIS
        Get a specific template by ID
    .PARAMETER TemplateId
        The ID of the template
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId
    )

    $templatesResult = Get-PIMTemplates
    if (-not $templatesResult.Success) {
        return $templatesResult
    }

    $template = $templatesResult.Templates | Where-Object { $_.Id -eq $TemplateId }

    if (-not $template) {
        return @{
            Success = $false
            Error = "Template not found: $TemplateId"
        }
    }

    return @{
        Success = $true
        Template = $template
    }
}

function Get-TemplatePreview {
    <#
    .SYNOPSIS
        Get a preview of what a template will configure
    .PARAMETER TemplateId
        The ID of the template
    .PARAMETER TierName
        Optional tier name to preview (if not specified, all tiers are shown)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId,

        [string]$TierName
    )

    $templateResult = Get-PIMTemplate -TemplateId $TemplateId
    if (-not $templateResult.Success) {
        return $templateResult
    }

    $template = $templateResult.Template
    $tiers = $template.Tiers

    if ($TierName) {
        $tiers = $tiers | Where-Object { $_.name -eq $TierName }
    }

    $preview = @{
        TemplateName = $template.Name
        Description = $template.Description
        Warning = $template.Warning
        Tiers = @()
    }

    foreach ($tier in $tiers) {
        $tierPreview = @{
            Name = $tier.name
            Description = $tier.description
            Roles = $tier.roles
            ApplyToAllRoles = $tier.applyToAllRoles
            ApplyToExternalUsers = $tier.applyToExternalUsers
            Settings = @{
                Activation = @{
                    MaximumDuration = "$($tier.settings.activation.maximumDurationHours) hours"
                    RequireMfa = $tier.settings.activation.requireMfa
                    RequireApproval = $tier.settings.activation.requireApproval
                    RequireJustification = $tier.settings.activation.requireJustification
                    RequireTicketInfo = $tier.settings.activation.requireTicketInfo
                }
                EligibleAssignment = @{
                    AllowPermanent = $tier.settings.eligibleAssignment.allowPermanent
                    MaximumDuration = if ($tier.settings.eligibleAssignment.maximumDurationDays) { "$($tier.settings.eligibleAssignment.maximumDurationDays) days" } else { "Permanent" }
                }
                ActiveAssignment = @{
                    AllowPermanent = $tier.settings.activeAssignment.allowPermanent
                    MaximumDuration = if ($tier.settings.activeAssignment.maximumDurationDays) { "$($tier.settings.activeAssignment.maximumDurationDays) days" } else { "Permanent" }
                    RequireMfa = $tier.settings.activeAssignment.requireMfa
                    RequireJustification = $tier.settings.activeAssignment.requireJustification
                }
            }
        }
        $preview.Tiers += $tierPreview
    }

    return @{
        Success = $true
        Preview = $preview
    }
}

#endregion

#region Template Application

function Apply-PIMTemplate {
    <#
    .SYNOPSIS
        Apply a template to a PIM group
    .PARAMETER TemplateId
        The ID of the template to apply
    .PARAMETER GroupId
        The ID of the group to apply the template to
    .PARAMETER TierName
        The tier within the template to apply
    .PARAMETER AccessId
        Apply to member or owner access (or both)
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId,

        [Parameter(Mandatory)]
        [string]$GroupId,

        [string]$TierName,

        [ValidateSet("member", "owner", "both")]
        [string]$AccessId = "member"
    )

    try {
        Write-PIMBuddyLog -Message "Applying template $TemplateId to group $GroupId" -Level "Info"

        # Get template
        $templateResult = Get-PIMTemplate -TemplateId $TemplateId
        if (-not $templateResult.Success) {
            return $templateResult
        }

        $template = $templateResult.Template
        $tier = $template.Tiers | Select-Object -First 1

        if ($TierName) {
            $tier = $template.Tiers | Where-Object { $_.name -eq $TierName }
            if (-not $tier) {
                return @{
                    Success = $false
                    Error = "Tier not found: $TierName"
                }
            }
        }

        if ($PSCmdlet.ShouldProcess($GroupId, "Apply template $($template.Name) - $($tier.name)")) {
            # Convert template settings to policy settings format
            $policySettings = Convert-TemplateToPolicySettings -TierSettings $tier.settings

            $results = @{
                Success = $true
                MemberResult = $null
                OwnerResult = $null
                Errors = @()
            }

            # Apply to member access
            if ($AccessId -in @("member", "both")) {
                $results.MemberResult = Set-PIMGroupPolicyFull -GroupId $GroupId -AccessId "member" -PolicySettings $policySettings
                if (-not $results.MemberResult.Success) {
                    $results.Errors += "Member: $($results.MemberResult.Error)"
                }
            }

            # Apply to owner access
            if ($AccessId -in @("owner", "both")) {
                $results.OwnerResult = Set-PIMGroupPolicyFull -GroupId $GroupId -AccessId "owner" -PolicySettings $policySettings
                if (-not $results.OwnerResult.Success) {
                    $results.Errors += "Owner: $($results.OwnerResult.Error)"
                }
            }

            $results.Success = $results.Errors.Count -eq 0

            if ($results.Success) {
                Write-PIMBuddyLog -Message "Template applied successfully" -Level "Success"
            }
            else {
                Write-PIMBuddyLog -Message "Template applied with errors: $($results.Errors -join '; ')" -Level "Warning"
            }

            return $results
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to apply template" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Convert-TemplateToPolicySettings {
    <#
    .SYNOPSIS
        Convert template tier settings to policy settings format
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        $TierSettings
    )

    $policySettings = @{
        Activation = @{
            MaximumDurationHours = $TierSettings.activation.maximumDurationHours
            RequireMfa = $TierSettings.activation.requireMfa
            RequireJustification = $TierSettings.activation.requireJustification
            RequireTicketInfo = $TierSettings.activation.requireTicketInfo
            RequireApproval = $TierSettings.activation.requireApproval
        }
        EligibleAssignment = @{
            AllowPermanent = $TierSettings.eligibleAssignment.allowPermanent
            MaximumDurationDays = $TierSettings.eligibleAssignment.maximumDurationDays
        }
        ActiveAssignment = @{
            AllowPermanent = $TierSettings.activeAssignment.allowPermanent
            MaximumDurationDays = $TierSettings.activeAssignment.maximumDurationDays
            RequireMfa = $TierSettings.activeAssignment.requireMfa
            RequireJustification = $TierSettings.activeAssignment.requireJustification
        }
        Notification = @{
            NotifyAssignee = $TierSettings.notification.notifyAssignee
            NotifyApprovers = $TierSettings.notification.notifyApprovers
        }
    }

    return $policySettings
}

function Apply-TemplateToMultipleGroups {
    <#
    .SYNOPSIS
        Apply a template to multiple groups
    .PARAMETER TemplateId
        The ID of the template to apply
    .PARAMETER GroupIds
        Array of group IDs to apply the template to
    .PARAMETER TierName
        The tier within the template to apply
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId,

        [Parameter(Mandatory)]
        [string[]]$GroupIds,

        [string]$TierName
    )

    $results = @{
        Success = $true
        TotalCount = $GroupIds.Count
        SuccessCount = 0
        FailedCount = 0
        Results = @()
    }

    foreach ($groupId in $GroupIds) {
        $applyResult = Apply-PIMTemplate -TemplateId $TemplateId -GroupId $groupId -TierName $TierName

        $results.Results += @{
            GroupId = $groupId
            Success = $applyResult.Success
            Error = if (-not $applyResult.Success) { $applyResult.Errors -join '; ' } else { $null }
        }

        if ($applyResult.Success) {
            $results.SuccessCount++
        }
        else {
            $results.FailedCount++
        }
    }

    $results.Success = $results.FailedCount -eq 0

    return $results
}

function Apply-PIMTemplateToRole {
    <#
    .SYNOPSIS
        Apply a template to an Entra ID role's PIM policy
    .PARAMETER TemplateId
        The ID of the template to apply
    .PARAMETER RoleDefinitionId
        The ID of the role definition to configure
    .PARAMETER TierName
        The tier within the template to apply
    #>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId,

        [Parameter(Mandatory)]
        [string]$RoleDefinitionId,

        [string]$TierName
    )

    try {
        Write-PIMBuddyLog -Message "Applying template $TemplateId to role $RoleDefinitionId" -Level "Info"

        # Get template
        $templateResult = Get-PIMTemplate -TemplateId $TemplateId
        if (-not $templateResult.Success) {
            return $templateResult
        }

        $template = $templateResult.Template
        $tier = $template.Tiers | Select-Object -First 1

        if ($TierName) {
            $tier = $template.Tiers | Where-Object { $_.name -eq $TierName }
            if (-not $tier) {
                return @{
                    Success = $false
                    Error = "Tier not found: $TierName"
                }
            }
        }

        if ($PSCmdlet.ShouldProcess($RoleDefinitionId, "Apply template $($template.Name) - $($tier.name)")) {
            $tierSettings = $tier.settings

            $results = @{
                Success = $true
                Errors = @()
            }

            # Apply activation settings to the role
            $activationParams = @{
                RoleDefinitionId = $RoleDefinitionId
            }

            if ($null -ne $tierSettings.activation.maximumDurationHours) {
                $activationParams.MaximumDurationHours = $tierSettings.activation.maximumDurationHours
            }
            if ($null -ne $tierSettings.activation.requireMfa) {
                $activationParams.RequireMfa = $tierSettings.activation.requireMfa
            }
            if ($null -ne $tierSettings.activation.requireJustification) {
                $activationParams.RequireJustification = $tierSettings.activation.requireJustification
            }
            if ($null -ne $tierSettings.activation.requireApproval) {
                $activationParams.RequireApproval = $tierSettings.activation.requireApproval
            }

            $activationResult = Set-EntraRoleActivationSettings @activationParams
            if (-not $activationResult.Success) {
                $results.Errors += "Activation: $($activationResult.Error)"
            }

            $results.Success = $results.Errors.Count -eq 0

            if ($results.Success) {
                Write-PIMBuddyLog -Message "Template applied to role successfully" -Level "Success"
            }
            else {
                Write-PIMBuddyLog -Message "Template applied with errors: $($results.Errors -join '; ')" -Level "Warning"
            }

            return $results
        }

        return @{
            Success = $false
            Error = "Operation cancelled"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to apply template to role" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Template Comparison

function Compare-WithTemplate {
    <#
    .SYNOPSIS
        Compare current group policy with a template
    .PARAMETER GroupId
        The ID of the group
    .PARAMETER TemplateId
        The ID of the template to compare with
    .PARAMETER TierName
        The tier within the template to compare
    .PARAMETER AccessId
        The access type to compare (member or owner)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$TemplateId,

        [string]$TierName,

        [ValidateSet("member", "owner")]
        [string]$AccessId = "member"
    )

    try {
        # Get current policy
        $currentPolicy = Get-PIMGroupPolicy -GroupId $GroupId -AccessId $AccessId
        if (-not $currentPolicy.Success) {
            return $currentPolicy
        }

        # Get template
        $templateResult = Get-PIMTemplate -TemplateId $TemplateId
        if (-not $templateResult.Success) {
            return $templateResult
        }

        $template = $templateResult.Template
        $tier = $template.Tiers | Select-Object -First 1
        if ($TierName) {
            $tier = $template.Tiers | Where-Object { $_.name -eq $TierName }
        }

        $templateSettings = $tier.settings
        $currentSettings = $currentPolicy.Settings

        # Compare settings
        $differences = @()

        # Activation settings
        if ($currentSettings.Activation.MaximumDurationHours -ne $templateSettings.activation.maximumDurationHours) {
            $differences += [PSCustomObject]@{
                Setting = "Activation Duration"
                Current = "$($currentSettings.Activation.MaximumDurationHours) hours"
                Template = "$($templateSettings.activation.maximumDurationHours) hours"
            }
        }

        if ($currentSettings.Activation.RequireMfa -ne $templateSettings.activation.requireMfa) {
            $differences += [PSCustomObject]@{
                Setting = "Require MFA"
                Current = $currentSettings.Activation.RequireMfa
                Template = $templateSettings.activation.requireMfa
            }
        }

        if ($currentSettings.Activation.RequireApproval -ne $templateSettings.activation.requireApproval) {
            $differences += [PSCustomObject]@{
                Setting = "Require Approval"
                Current = $currentSettings.Activation.RequireApproval
                Template = $templateSettings.activation.requireApproval
            }
        }

        if ($currentSettings.Activation.RequireJustification -ne $templateSettings.activation.requireJustification) {
            $differences += [PSCustomObject]@{
                Setting = "Require Justification"
                Current = $currentSettings.Activation.RequireJustification
                Template = $templateSettings.activation.requireJustification
            }
        }

        # Eligible assignment settings
        if ($currentSettings.EligibleAssignment.AllowPermanent -ne $templateSettings.eligibleAssignment.allowPermanent) {
            $differences += [PSCustomObject]@{
                Setting = "Allow Permanent Eligible"
                Current = $currentSettings.EligibleAssignment.AllowPermanent
                Template = $templateSettings.eligibleAssignment.allowPermanent
            }
        }

        # Active assignment settings
        if ($currentSettings.ActiveAssignment.AllowPermanent -ne $templateSettings.activeAssignment.allowPermanent) {
            $differences += [PSCustomObject]@{
                Setting = "Allow Permanent Active"
                Current = $currentSettings.ActiveAssignment.AllowPermanent
                Template = $templateSettings.activeAssignment.allowPermanent
            }
        }

        $isCompliant = $differences.Count -eq 0

        return @{
            Success = $true
            IsCompliant = $isCompliant
            DifferenceCount = $differences.Count
            Differences = $differences
            TemplateName = $template.Name
            TierName = $tier.name
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to compare with template" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Best Practices

function Get-BestPractices {
    <#
    .SYNOPSIS
        Get the list of best practice recommendations
    #>
    [CmdletBinding()]
    param()

    try {
        if (-not (Test-Path $script:TemplatesPath)) {
            return @{
                Success = $false
                Error = "Templates file not found"
            }
        }

        $templatesData = Get-Content $script:TemplatesPath -Raw | ConvertFrom-Json

        return @{
            Success = $true
            BestPractices = $templatesData.bestPractices
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to load best practices" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

function Test-BestPractices {
    <#
    .SYNOPSIS
        Evaluate current configuration against best practices
    #>
    [CmdletBinding()]
    param()

    try {
        $bpResult = Get-BestPractices
        if (-not $bpResult.Success) {
            return $bpResult
        }

        $bestPractices = $bpResult.BestPractices
        $violations = @()
        $warnings = @()

        # Get role statistics
        $roleStats = Get-EntraRoleStatistics
        if ($roleStats.Success) {
            # Check Global Admin count
            $gaLimit = ($bestPractices | Where-Object { $_.id -eq "limit-global-admins" }).threshold
            if ($roleStats.Statistics.GlobalAdminCount -gt $gaLimit) {
                $violations += [PSCustomObject]@{
                    Id = "limit-global-admins"
                    Severity = "high"
                    Title = "Too Many Global Administrators"
                    Description = "You have $($roleStats.Statistics.GlobalAdminCount) Global Administrators. Microsoft recommends no more than $gaLimit."
                    Recommendation = "Review and reduce Global Administrator assignments. Consider using more specific roles."
                }
            }
        }

        # Get PIM groups and check their policies
        $groupsResult = Get-PIMGroups
        if ($groupsResult.Success) {
            foreach ($group in $groupsResult.Groups) {
                $policyResult = Get-PIMGroupPolicy -GroupId $group.Id -AccessId "member"
                if ($policyResult.Success) {
                    $settings = $policyResult.Settings

                    # Check MFA requirement
                    if (-not $settings.Activation.RequireMfa) {
                        $warnings += [PSCustomObject]@{
                            Id = "require-mfa"
                            Severity = "medium"
                            Title = "MFA Not Required"
                            Description = "Group '$($group.DisplayName)' does not require MFA on activation."
                            Recommendation = "Enable 'Require MFA on activation' for this group."
                            GroupId = $group.Id
                            GroupName = $group.DisplayName
                        }
                    }

                    # Check justification requirement
                    if (-not $settings.Activation.RequireJustification) {
                        $warnings += [PSCustomObject]@{
                            Id = "require-justification"
                            Severity = "low"
                            Title = "Justification Not Required"
                            Description = "Group '$($group.DisplayName)' does not require justification on activation."
                            Recommendation = "Enable 'Require justification on activation' for audit purposes."
                            GroupId = $group.Id
                            GroupName = $group.DisplayName
                        }
                    }

                    # Check activation duration
                    if ($settings.Activation.MaximumDurationHours -gt 8) {
                        $warnings += [PSCustomObject]@{
                            Id = "short-activation"
                            Severity = "medium"
                            Title = "Long Activation Duration"
                            Description = "Group '$($group.DisplayName)' allows $($settings.Activation.MaximumDurationHours) hour activations."
                            Recommendation = "Consider reducing activation duration to 8 hours or less."
                            GroupId = $group.Id
                            GroupName = $group.DisplayName
                        }
                    }
                }
            }
        }

        $allFindings = @($violations) + @($warnings)

        return @{
            Success = $true
            ViolationCount = @($violations).Count
            WarningCount = @($warnings).Count
            TotalFindings = @($allFindings).Count
            Violations = @($violations)
            Warnings = @($warnings)
            AllFindings = @($allFindings) | Sort-Object { switch ($_.Severity) { "high" { 1 } "medium" { 2 } "low" { 3 } default { 4 } } }
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to test best practices" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Error = Get-FriendlyErrorMessage -Exception $_.Exception
        }
    }
}

#endregion

#region Custom Template Management

function New-PIMCustomTemplate {
    <#
    .SYNOPSIS
        Create a new custom template
    .PARAMETER Name
        Display name for the template
    .PARAMETER Description
        Description of the template
    .PARAMETER Settings
        Hashtable containing the template settings
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name,

        [string]$Description = "",

        [Parameter(Mandatory)]
        [hashtable]$Settings
    )

    try {
        # Generate unique ID
        $templateId = "custom-" + (New-Guid).ToString().Substring(0, 8)

        # Load existing custom templates
        $customTemplates = @()
        if (Test-Path $script:CustomTemplatesPath) {
            $existingData = Get-Content $script:CustomTemplatesPath -Raw | ConvertFrom-Json
            $customTemplates = @($existingData.templates)
        }

        # Create new template structure
        $newTemplate = @{
            id = $templateId
            name = $Name
            description = $Description
            icon = ""
            tiers = @(
                @{
                    name = "Default"
                    description = "Custom configuration"
                    roles = @()
                    settings = @{
                        activation = @{
                            maximumDurationHours = if ($Settings.MaximumDurationHours) { $Settings.MaximumDurationHours } else { 8 }
                            requireMfa = if ($null -ne $Settings.RequireMfa) { $Settings.RequireMfa } else { $true }
                            requireApproval = if ($null -ne $Settings.RequireApproval) { $Settings.RequireApproval } else { $false }
                            requireJustification = if ($null -ne $Settings.RequireJustification) { $Settings.RequireJustification } else { $true }
                            requireTicketInfo = if ($null -ne $Settings.RequireTicketInfo) { $Settings.RequireTicketInfo } else { $false }
                        }
                        eligibleAssignment = @{
                            allowPermanent = if ($null -ne $Settings.AllowPermanentEligible) { $Settings.AllowPermanentEligible } else { $true }
                            maximumDurationDays = if ($Settings.EligibleDurationDays) { $Settings.EligibleDurationDays } else { 365 }
                        }
                        activeAssignment = @{
                            allowPermanent = if ($null -ne $Settings.AllowPermanentActive) { $Settings.AllowPermanentActive } else { $false }
                            maximumDurationDays = if ($Settings.ActiveDurationDays) { $Settings.ActiveDurationDays } else { 30 }
                            requireMfa = if ($null -ne $Settings.ActiveRequireMfa) { $Settings.ActiveRequireMfa } else { $true }
                            requireJustification = if ($null -ne $Settings.ActiveRequireJustification) { $Settings.ActiveRequireJustification } else { $true }
                        }
                        notification = @{
                            notifyAssignee = $true
                            notifyApprovers = $true
                        }
                    }
                }
            )
        }

        $customTemplates += $newTemplate

        # Save to file
        $outputData = @{
            version = "1.0"
            templates = $customTemplates
        }

        $configDir = Split-Path $script:CustomTemplatesPath -Parent
        if (-not (Test-Path $configDir)) {
            New-Item -ItemType Directory -Path $configDir -Force | Out-Null
        }

        $outputData | ConvertTo-Json -Depth 10 | Set-Content -Path $script:CustomTemplatesPath -Encoding UTF8

        # Refresh templates
        $script:CustomTemplates = $null
        Get-PIMTemplates -Refresh | Out-Null

        Write-TemplateLog -Message "Created custom template: $Name ($templateId)" -Level "Success"

        return @{
            Success = $true
            TemplateId = $templateId
            TemplateName = $Name
        }
    }
    catch {
        Write-TemplateLog -Message "Failed to create custom template: $($_.Exception.Message)" -Level "Error"
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Remove-PIMCustomTemplate {
    <#
    .SYNOPSIS
        Delete a custom template
    .PARAMETER TemplateId
        The ID of the template to delete
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$TemplateId
    )

    try {
        if (-not (Test-Path $script:CustomTemplatesPath)) {
            return @{
                Success = $false
                Error = "No custom templates exist"
            }
        }

        $existingData = Get-Content $script:CustomTemplatesPath -Raw | ConvertFrom-Json
        $customTemplates = @($existingData.templates | Where-Object { $_.id -ne $TemplateId })

        if ($customTemplates.Count -eq $existingData.templates.Count) {
            return @{
                Success = $false
                Error = "Template not found: $TemplateId"
            }
        }

        # Save updated list
        $outputData = @{
            version = "1.0"
            templates = $customTemplates
        }

        $outputData | ConvertTo-Json -Depth 10 | Set-Content -Path $script:CustomTemplatesPath -Encoding UTF8

        # Refresh templates
        $script:CustomTemplates = $null
        Get-PIMTemplates -Refresh | Out-Null

        Write-TemplateLog -Message "Deleted custom template: $TemplateId" -Level "Success"

        return @{
            Success = $true
            TemplateId = $TemplateId
        }
    }
    catch {
        Write-TemplateLog -Message "Failed to delete custom template: $($_.Exception.Message)" -Level "Error"
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Get-CustomTemplates {
    <#
    .SYNOPSIS
        Get only custom templates
    #>
    [CmdletBinding()]
    param()

    return Get-PIMTemplates -CustomOnly
}

function Save-CurrentPolicyAsTemplate {
    <#
    .SYNOPSIS
        Save the current policy settings of a group as a custom template
    .PARAMETER GroupId
        The ID of the group to copy settings from
    .PARAMETER TemplateName
        Name for the new template
    .PARAMETER Description
        Description for the template
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$GroupId,

        [Parameter(Mandatory)]
        [string]$TemplateName,

        [string]$Description = "Saved from existing group policy"
    )

    try {
        # Get current policy
        $policyResult = Get-PIMGroupPolicy -GroupId $GroupId -AccessId "member"
        if (-not $policyResult.Success) {
            return @{
                Success = $false
                Error = "Failed to get group policy: $($policyResult.Error)"
            }
        }

        $settings = $policyResult.Settings

        # Create template from current settings
        $templateSettings = @{
            MaximumDurationHours = $settings.Activation.MaximumDurationHours
            RequireMfa = $settings.Activation.RequireMfa
            RequireJustification = $settings.Activation.RequireJustification
            RequireTicketInfo = $settings.Activation.RequireTicketInfo
            RequireApproval = $settings.Activation.RequireApproval
            AllowPermanentEligible = $settings.EligibleAssignment.AllowPermanent
            EligibleDurationDays = $settings.EligibleAssignment.MaximumDurationDays
            AllowPermanentActive = $settings.ActiveAssignment.AllowPermanent
            ActiveDurationDays = $settings.ActiveAssignment.MaximumDurationDays
            ActiveRequireMfa = $settings.ActiveAssignment.RequireMfa
            ActiveRequireJustification = $settings.ActiveAssignment.RequireJustification
        }

        return New-PIMCustomTemplate -Name $TemplateName -Description $Description -Settings $templateSettings
    }
    catch {
        Write-TemplateLog -Message "Failed to save policy as template: $($_.Exception.Message)" -Level "Error"
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

#endregion

# Export all functions
Export-ModuleMember -Function *
