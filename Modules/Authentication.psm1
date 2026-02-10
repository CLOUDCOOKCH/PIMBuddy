<#
.SYNOPSIS
    PIMBuddy Authentication Module
.DESCRIPTION
    Microsoft Graph authentication and connection management using Microsoft.Graph SDK
#>

# Helper functions should already be loaded by the main script

# Script-level variables
$script:GraphConnection = $null
$script:CurrentTenant = $null
$script:CurrentUser = $null
$script:ConnectionTime = $null

# Cloud environments
$script:CloudEnvironments = @{
    "Commercial" = @{
        Name = "Global"
        GraphEndpoint = "https://graph.microsoft.com"
        AzureADEndpoint = "https://login.microsoftonline.com"
        Environment = "Global"
    }
    "GCC" = @{
        Name = "US Government"
        GraphEndpoint = "https://graph.microsoft.com"
        AzureADEndpoint = "https://login.microsoftonline.com"
        Environment = "USGov"
    }
    "GCC-High" = @{
        Name = "US Government High"
        GraphEndpoint = "https://graph.microsoft.us"
        AzureADEndpoint = "https://login.microsoftonline.us"
        Environment = "USGovDoD"
    }
    "DoD" = @{
        Name = "US DoD"
        GraphEndpoint = "https://dod-graph.microsoft.us"
        AzureADEndpoint = "https://login.microsoftonline.us"
        Environment = "USGovDoD"
    }
}

# Required Graph API scopes
$script:RequiredScopes = @(
    "PrivilegedAccess.ReadWrite.AzureADGroup",
    "RoleManagement.ReadWrite.Directory",
    "Group.ReadWrite.All",
    "User.Read.All",
    "Directory.Read.All",
    "Policy.Read.All",
    "Policy.ReadWrite.PermissionGrant",
    "RoleManagementPolicy.ReadWrite.Directory",
    "RoleEligibilitySchedule.ReadWrite.Directory",
    "RoleAssignmentSchedule.ReadWrite.Directory"
)

function Connect-PIMBuddy {
    <#
    .SYNOPSIS
        Connect to Microsoft Graph with required PIM scopes
    .PARAMETER CloudEnvironment
        The cloud environment to connect to (Commercial, GCC, GCC-High, DoD)
    .PARAMETER TenantId
        Optional tenant ID to connect to a specific tenant
    #>
    [CmdletBinding()]
    param(
        [ValidateSet("Commercial", "GCC", "GCC-High", "DoD")]
        [string]$CloudEnvironment = "Commercial",

        [string]$TenantId
    )

    try {
        Write-PIMBuddyLog -Message "Initiating connection to $CloudEnvironment environment" -Level "Info"

        # Disconnect any existing session
        if (Get-MgContext) {
            Write-PIMBuddyLog -Message "Disconnecting existing Graph session" -Level "Debug"
            Disconnect-MgGraph -ErrorAction SilentlyContinue | Out-Null
        }

        # Build connection parameters
        $connectParams = @{
            Scopes = $script:RequiredScopes
            NoWelcome = $true
        }

        # Set environment
        $envConfig = $script:CloudEnvironments[$CloudEnvironment]
        if ($CloudEnvironment -ne "Commercial") {
            $connectParams["Environment"] = $envConfig.Environment
        }

        # Add tenant if specified
        if ($TenantId) {
            $connectParams["TenantId"] = $TenantId
        }

        # Connect to Graph (this will open browser for interactive login)
        Write-PIMBuddyLog -Message "Opening browser for authentication..." -Level "Info"
        Connect-MgGraph @connectParams

        # Verify connection
        $context = Get-MgContext
        if (-not $context) {
            throw "Failed to establish Graph connection"
        }

        # Store connection info
        $script:GraphConnection = $context
        $script:ConnectionTime = Get-Date

        # Get tenant info
        $script:CurrentTenant = Get-TenantInfo
        $script:CurrentUser = Get-CurrentUser

        Write-PIMBuddyLog -Message "Successfully connected to $($script:CurrentTenant.DisplayName)" -Level "Success"

        return @{
            Success = $true
            Tenant = $script:CurrentTenant
            User = $script:CurrentUser
            Environment = $CloudEnvironment
            Scopes = $context.Scopes
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to connect to Microsoft Graph" -Level "Error" -Exception $_.Exception
        $script:GraphConnection = $null
        $script:CurrentTenant = $null
        $script:CurrentUser = $null

        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Disconnect-PIMBuddy {
    <#
    .SYNOPSIS
        Disconnect from Microsoft Graph
    #>
    [CmdletBinding()]
    param()

    try {
        if (Get-MgContext) {
            Disconnect-MgGraph -ErrorAction SilentlyContinue | Out-Null
        }

        $script:GraphConnection = $null
        $script:CurrentTenant = $null
        $script:CurrentUser = $null
        $script:ConnectionTime = $null

        Write-PIMBuddyLog -Message "Disconnected from Microsoft Graph" -Level "Info"

        return @{ Success = $true }
    }
    catch {
        Write-PIMBuddyLog -Message "Error during disconnect" -Level "Warning" -Exception $_.Exception
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

function Test-PIMBuddyConnection {
    <#
    .SYNOPSIS
        Test if there is an active Graph connection
    #>
    [CmdletBinding()]
    param()

    try {
        $context = Get-MgContext
        if (-not $context) {
            return @{
                Connected = $false
                Message = "No active connection"
            }
        }

        # Verify connection is still valid by making a simple API call
        $null = Get-MgOrganization -ErrorAction Stop | Select-Object -First 1

        return @{
            Connected = $true
            TenantId = $context.TenantId
            Account = $context.Account
            Scopes = $context.Scopes
            ConnectionTime = $script:ConnectionTime
        }
    }
    catch {
        # Connection may have expired
        Write-PIMBuddyLog -Message "Connection test failed" -Level "Warning" -Exception $_.Exception
        return @{
            Connected = $false
            Message = "Connection expired or invalid"
            Error = $_.Exception.Message
        }
    }
}

function Get-TenantInfo {
    <#
    .SYNOPSIS
        Get information about the connected tenant
    #>
    [CmdletBinding()]
    param()

    try {
        $org = Get-MgOrganization | Select-Object -First 1

        return [PSCustomObject]@{
            Id = $org.Id
            DisplayName = $org.DisplayName
            TenantType = $org.TenantType
            VerifiedDomains = $org.VerifiedDomains | Where-Object { $_.IsDefault } | Select-Object -ExpandProperty Name
            DefaultDomain = ($org.VerifiedDomains | Where-Object { $_.IsDefault }).Name
            CreatedDateTime = $org.CreatedDateTime
            CountryCode = $org.CountryLetterCode
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get tenant info" -Level "Error" -Exception $_.Exception
        return $null
    }
}

function Get-CurrentUser {
    <#
    .SYNOPSIS
        Get information about the currently signed-in user
    #>
    [CmdletBinding()]
    param()

    try {
        $user = Get-MgUser -UserId (Get-MgContext).Account -Property "Id,DisplayName,UserPrincipalName,Mail,JobTitle"

        return [PSCustomObject]@{
            Id = $user.Id
            DisplayName = $user.DisplayName
            UserPrincipalName = $user.UserPrincipalName
            Email = $user.Mail
            JobTitle = $user.JobTitle
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to get current user info" -Level "Warning" -Exception $_.Exception

        # Fallback to context info
        $context = Get-MgContext
        return [PSCustomObject]@{
            Id = $null
            DisplayName = $context.Account
            UserPrincipalName = $context.Account
            Email = $context.Account
            JobTitle = $null
        }
    }
}

function Get-PIMBuddyConnectionState {
    <#
    .SYNOPSIS
        Get the current connection state for UI display
    #>
    [CmdletBinding()]
    param()

    $test = Test-PIMBuddyConnection

    return [PSCustomObject]@{
        IsConnected = $test.Connected
        TenantName = if ($script:CurrentTenant) { $script:CurrentTenant.DisplayName } else { "" }
        TenantDomain = if ($script:CurrentTenant) { $script:CurrentTenant.DefaultDomain } else { "" }
        UserName = if ($script:CurrentUser) { $script:CurrentUser.UserPrincipalName } else { "" }
        UserDisplayName = if ($script:CurrentUser) { $script:CurrentUser.DisplayName } else { "" }
        ConnectionTime = $script:ConnectionTime
        SessionDuration = if ($script:ConnectionTime) { (Get-Date) - $script:ConnectionTime } else { $null }
    }
}

function Test-PIMBuddyLicense {
    <#
    .SYNOPSIS
        Check if the tenant has required licensing for PIM
    .DESCRIPTION
        PIM requires Azure AD Premium P2 or Microsoft Entra ID Governance
    #>
    [CmdletBinding()]
    param()

    try {
        # Check for P2 or Governance licenses
        $subscribedSkus = Get-MgSubscribedSku

        $pimCapableLicenses = @(
            "AAD_PREMIUM_P2",           # Azure AD Premium P2
            "IDENTITY_GOVERNANCE",       # Microsoft Entra ID Governance
            "EMSPREMIUM",               # EMS E5 (includes P2)
            "SPE_E5",                   # Microsoft 365 E5
            "ENTERPRISEPREMIUM",        # Office 365 E5
            "M365_E5_SUITE"             # Microsoft 365 E5 Suite
        )

        $hasLicense = $false
        $licenseName = ""

        foreach ($sku in $subscribedSkus) {
            foreach ($license in $pimCapableLicenses) {
                if ($sku.SkuPartNumber -like "*$license*" -and $sku.CapabilityStatus -eq "Enabled") {
                    $hasLicense = $true
                    $licenseName = $sku.SkuPartNumber
                    break
                }
            }
            if ($hasLicense) { break }
        }

        if ($hasLicense) {
            Write-PIMBuddyLog -Message "PIM-capable license found: $licenseName" -Level "Success"
            return @{
                HasLicense = $true
                LicenseName = $licenseName
                Message = "PIM-capable license found: $licenseName"
            }
        }
        else {
            Write-PIMBuddyLog -Message "No PIM-capable license found" -Level "Warning"
            return @{
                HasLicense = $false
                LicenseName = $null
                Message = "PIM requires Azure AD Premium P2 or Microsoft Entra ID Governance license"
            }
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to check licenses" -Level "Warning" -Exception $_.Exception
        return @{
            HasLicense = $null  # Unknown
            LicenseName = $null
            Message = "Unable to verify license status: $($_.Exception.Message)"
        }
    }
}

function Get-PIMBuddyPermissions {
    <#
    .SYNOPSIS
        Check if the current user has required permissions for PIM operations
    #>
    [CmdletBinding()]
    param()

    $context = Get-MgContext
    if (-not $context) {
        return @{
            HasPermissions = $false
            MissingScopes = $script:RequiredScopes
            Message = "Not connected"
        }
    }

    $grantedScopes = $context.Scopes
    $missingScopes = $script:RequiredScopes | Where-Object { $_ -notin $grantedScopes }

    if ($missingScopes.Count -eq 0) {
        return @{
            HasPermissions = $true
            GrantedScopes = $grantedScopes
            MissingScopes = @()
            Message = "All required permissions granted"
        }
    }
    else {
        return @{
            HasPermissions = $false
            GrantedScopes = $grantedScopes
            MissingScopes = $missingScopes
            Message = "Missing permissions: $($missingScopes -join ', ')"
        }
    }
}

function Get-CloudEnvironments {
    <#
    .SYNOPSIS
        Get available cloud environments for connection
    #>
    [CmdletBinding()]
    param()

    return $script:CloudEnvironments.GetEnumerator() | ForEach-Object {
        [PSCustomObject]@{
            Key = $_.Key
            Name = $_.Value.Name
            GraphEndpoint = $_.Value.GraphEndpoint
        }
    }
}

function Get-RequiredScopes {
    <#
    .SYNOPSIS
        Get the list of required Graph API scopes
    #>
    [CmdletBinding()]
    param()

    return $script:RequiredScopes
}

# Export all functions
Export-ModuleMember -Function *
