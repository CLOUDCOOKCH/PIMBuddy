<#
.SYNOPSIS
    PIMBuddy Helper Functions Module
.DESCRIPTION
    Common utilities, logging, notifications, and settings management for PIMBuddy
#>

# Script-level variables
$script:LogPath = Join-Path $PSScriptRoot "..\Logs"
$script:SettingsPath = Join-Path $PSScriptRoot "..\Config\Settings.json"
$script:VerboseLogging = $false
$script:LogFile = $null

# PERFORMANCE: Buffered logging to reduce file I/O
$script:LogBuffer = [System.Collections.Generic.List[string]]::new()
$script:LogBufferSize = 20  # Flush after 20 entries
$script:LastFlush = [DateTime]::Now

#region Logging Functions

function Initialize-PIMBuddyLogging {
    <#
    .SYNOPSIS
        Initialize logging for PIMBuddy session
    #>
    [CmdletBinding()]
    param(
        [switch]$EnableVerbose
    )

    $script:VerboseLogging = $EnableVerbose
    $script:LogBuffer = [System.Collections.Generic.List[string]]::new()

    # Create logs directory if needed
    if (-not (Test-Path $script:LogPath)) {
        New-Item -ItemType Directory -Path $script:LogPath -Force | Out-Null
    }

    # Create session log file
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $script:LogFile = Join-Path $script:LogPath "PIMBuddy_$timestamp.log"

    Write-PIMBuddyLog -Message "PIMBuddy session started" -Level "Info"
}

function Flush-LogBuffer {
    <#
    .SYNOPSIS
        Flush buffered log entries to file
    #>
    [CmdletBinding()]
    param()

    if ($script:LogBuffer.Count -eq 0) { return }
    if (-not $script:LogFile) { return }

    try {
        $logDir = Split-Path $script:LogFile -Parent
        if (Test-Path $logDir) {
            # Write all buffered entries at once
            $script:LogBuffer -join "`n" | Add-Content -Path $script:LogFile -ErrorAction SilentlyContinue
            $script:LogBuffer.Clear()
            $script:LastFlush = [DateTime]::Now
        }
    }
    catch {
        # Silently fail - don't let logging errors affect the app
    }
}

function Write-PIMBuddyLog {
    <#
    .SYNOPSIS
        Write a log entry (buffered for performance)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Message,

        [ValidateSet("Info", "Warning", "Error", "Debug", "Success")]
        [string]$Level = "Info",

        [System.Exception]$Exception
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"

    if ($Exception) {
        $logEntry += "`n  Exception: $($Exception.Message)"
        if ($script:VerboseLogging) {
            $logEntry += "`n  StackTrace: $($Exception.StackTrace)"
        }
    }

    # PERFORMANCE: Buffer log entries instead of writing immediately
    if ($script:LogFile) {
        $script:LogBuffer.Add($logEntry)

        # Flush buffer when full OR for errors (immediate write) OR every 5 seconds
        $shouldFlush = ($script:LogBuffer.Count -ge $script:LogBufferSize) -or
                       ($Level -eq "Error") -or
                       (([DateTime]::Now - $script:LastFlush).TotalSeconds -gt 5)

        if ($shouldFlush) {
            Flush-LogBuffer
        }
    }

    # Also write to console if verbose
    if ($script:VerboseLogging -or $Level -in @("Error", "Warning")) {
        switch ($Level) {
            "Error"   { Write-Host $logEntry -ForegroundColor Red }
            "Warning" { Write-Host $logEntry -ForegroundColor Yellow }
            "Success" { Write-Host $logEntry -ForegroundColor Green }
            "Debug"   { Write-Host $logEntry -ForegroundColor Gray }
            default   { Write-Host $logEntry }
        }
    }
}

#endregion

#region Settings Management

function Get-PIMBuddySettings {
    <#
    .SYNOPSIS
        Load PIMBuddy settings from configuration file
    #>
    [CmdletBinding()]
    param()

    $defaultSettings = @{
        Theme = "Light"
        CloudEnvironment = "Commercial"
        LastTenantId = ""
        VerboseLogging = $false
        AutoConnect = $false
        DefaultActivationDuration = 4
        ShowBestPracticeWarnings = $true
        ExportPath = [Environment]::GetFolderPath("MyDocuments")
    }

    if (Test-Path $script:SettingsPath) {
        try {
            $savedSettings = Get-Content $script:SettingsPath -Raw | ConvertFrom-Json -AsHashtable
            # Merge saved settings with defaults
            foreach ($key in $savedSettings.Keys) {
                if ($defaultSettings.ContainsKey($key)) {
                    $defaultSettings[$key] = $savedSettings[$key]
                }
            }
            Write-PIMBuddyLog -Message "Settings loaded successfully" -Level "Debug"
        }
        catch {
            Write-PIMBuddyLog -Message "Failed to load settings, using defaults" -Level "Warning" -Exception $_.Exception
        }
    }

    return [PSCustomObject]$defaultSettings
}

function Save-PIMBuddySettings {
    <#
    .SYNOPSIS
        Save PIMBuddy settings to configuration file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [PSCustomObject]$Settings
    )

    try {
        $configDir = Split-Path $script:SettingsPath -Parent
        if (-not (Test-Path $configDir)) {
            New-Item -ItemType Directory -Path $configDir -Force | Out-Null
        }

        $Settings | ConvertTo-Json -Depth 10 | Set-Content $script:SettingsPath -Force
        Write-PIMBuddyLog -Message "Settings saved successfully" -Level "Debug"
        return $true
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to save settings" -Level "Error" -Exception $_.Exception
        return $false
    }
}

#endregion

#region UI Helper Functions

function Show-PIMBuddyToast {
    <#
    .SYNOPSIS
        Show a toast notification in the UI
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Message,

        [ValidateSet("Success", "Error", "Warning", "Info")]
        [string]$Type = "Info",

        [int]$DurationMs = 3000,

        [System.Windows.Window]$Window
    )

    Write-PIMBuddyLog -Message "Toast: [$Type] $Message" -Level $Type

    if (-not $Window) {
        return
    }

    # Find toast container
    $toastContainer = $Window.FindName("ToastContainer")
    if (-not $toastContainer) { return }

    # Create toast border
    $toast = New-Object System.Windows.Controls.Border
    $toast.Name = "Toast_$(Get-Random)"
    $toast.Padding = [System.Windows.Thickness]::new(16, 12, 16, 12)
    $toast.Margin = [System.Windows.Thickness]::new(0, 0, 0, 8)
    $toast.CornerRadius = [System.Windows.CornerRadius]::new(8)

    # Set color based on type
    $bgColor = switch ($Type) {
        "Success" { "#107C10" }
        "Error"   { "#D13438" }
        "Warning" { "#FFB900" }
        default   { "#0078D4" }
    }
    $toast.Background = [System.Windows.Media.BrushConverter]::new().ConvertFromString($bgColor)

    # Create text
    $text = New-Object System.Windows.Controls.TextBlock
    $text.Text = $Message
    $text.Foreground = [System.Windows.Media.Brushes]::White
    $text.FontSize = 14
    $toast.Child = $text

    # Add to container
    $toastContainer.Children.Add($toast)

    # Auto-remove after duration - store references in Tag for timer access
    $timer = New-Object System.Windows.Threading.DispatcherTimer
    $timer.Interval = [TimeSpan]::FromMilliseconds($DurationMs)
    $timer.Tag = @{ Container = $toastContainer; Toast = $toast; Timer = $timer }
    $timer.Add_Tick({
        param($s, $e)
        $data = $s.Tag
        $data.Container.Children.Remove($data.Toast)
        $s.Stop()
    })
    $timer.Start()
}

function Show-PIMBuddyProgress {
    <#
    .SYNOPSIS
        Show or update progress indicator
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,

        [string]$Message = "Loading...",

        [int]$PercentComplete = -1,

        [switch]$Hide
    )

    $progressPanel = $Window.FindName("ProgressPanel")
    $progressBar = $Window.FindName("ProgressBar")
    $progressText = $Window.FindName("ProgressText")

    if (-not $progressPanel) { return }

    if ($Hide) {
        $progressPanel.Visibility = [System.Windows.Visibility]::Collapsed
    }
    else {
        $progressPanel.Visibility = [System.Windows.Visibility]::Visible
        if ($progressText) { $progressText.Text = $Message }
        if ($progressBar -and $PercentComplete -ge 0) {
            $progressBar.IsIndeterminate = $false
            $progressBar.Value = $PercentComplete
        }
        elseif ($progressBar) {
            $progressBar.IsIndeterminate = $true
        }
    }
}

function Update-PIMBuddyStatus {
    <#
    .SYNOPSIS
        Update the status bar connection state
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,

        [bool]$Connected,

        [string]$TenantName = "",

        [string]$UserName = ""
    )

    $statusIndicator = $Window.FindName("ConnectionIndicator")
    $statusText = $Window.FindName("ConnectionText")

    if ($statusIndicator) {
        $color = if ($Connected) { "#107C10" } else { "#D13438" }
        $statusIndicator.Fill = [System.Windows.Media.BrushConverter]::new().ConvertFromString($color)
    }

    if ($statusText) {
        if ($Connected -and $TenantName) {
            $statusText.Text = "Connected: $TenantName | User: $UserName"
        }
        else {
            $statusText.Text = "Not Connected"
        }
    }
}

#endregion

#region Error Handling

function Invoke-PIMBuddyOperation {
    <#
    .SYNOPSIS
        Execute an operation with standardized error handling
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [scriptblock]$Operation,

        [string]$OperationName = "Operation",

        [System.Windows.Window]$Window,

        [switch]$ShowProgress,

        [switch]$SuppressToast
    )

    try {
        Write-PIMBuddyLog -Message "Starting: $OperationName" -Level "Debug"

        if ($ShowProgress -and $Window) {
            Show-PIMBuddyProgress -Window $Window -Message "$OperationName..."
        }

        $result = & $Operation

        Write-PIMBuddyLog -Message "Completed: $OperationName" -Level "Success"

        if (-not $SuppressToast -and $Window) {
            Show-PIMBuddyToast -Window $Window -Message "$OperationName completed successfully" -Type "Success"
        }

        return @{
            Success = $true
            Result = $result
            Error = $null
        }
    }
    catch {
        $errorMessage = Get-FriendlyErrorMessage -Exception $_.Exception
        Write-PIMBuddyLog -Message "Failed: $OperationName - $errorMessage" -Level "Error" -Exception $_.Exception

        if (-not $SuppressToast -and $Window) {
            Show-PIMBuddyToast -Window $Window -Message "$OperationName failed: $errorMessage" -Type "Error" -DurationMs 5000
        }

        return @{
            Success = $false
            Result = $null
            Error = $errorMessage
            Exception = $_.Exception
        }
    }
    finally {
        if ($ShowProgress -and $Window) {
            Show-PIMBuddyProgress -Window $Window -Hide
        }
    }
}

function Get-FriendlyErrorMessage {
    <#
    .SYNOPSIS
        Convert technical errors to user-friendly messages
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [System.Exception]$Exception
    )

    $message = $Exception.Message

    # Common Graph API errors
    $friendlyMessages = @{
        "Authorization_RequestDenied" = "You don't have permission to perform this action. Please check your role assignments."
        "Request_ResourceNotFound" = "The requested resource was not found. It may have been deleted or you may not have access."
        "Authentication_ExpiredToken" = "Your session has expired. Please reconnect to continue."
        "InvalidAuthenticationToken" = "Authentication failed. Please reconnect."
        "Request_BadRequest" = "Invalid request. Please check your input and try again."
        "Forbidden" = "Access denied. This operation requires additional permissions or licensing."
        "TenantDoesNotHaveAADPremiumLicense" = "This feature requires Azure AD Premium P2 or Microsoft Entra ID Governance license."
    }

    foreach ($key in $friendlyMessages.Keys) {
        if ($message -match $key) {
            return $friendlyMessages[$key]
        }
    }

    # Return original message if no match
    return $message
}

#endregion

#region Validation Functions

function Test-PIMBuddyPrerequisites {
    <#
    .SYNOPSIS
        Check if all required modules are installed
    #>
    [CmdletBinding()]
    param()

    $requiredModules = @(
        "Microsoft.Graph.Authentication",
        "Microsoft.Graph.Identity.Governance",
        "Microsoft.Graph.Groups",
        "Microsoft.Graph.Users",
        "Microsoft.Graph.Identity.DirectoryManagement"
    )

    $missingModules = @()

    foreach ($module in $requiredModules) {
        if (-not (Get-Module -ListAvailable -Name $module)) {
            $missingModules += $module
        }
    }

    if ($missingModules.Count -gt 0) {
        return @{
            Success = $false
            MissingModules = $missingModules
            Message = "Missing required modules: $($missingModules -join ', ')"
        }
    }

    return @{
        Success = $true
        MissingModules = @()
        Message = "All prerequisites met"
    }
}

function Test-GroupNameValid {
    <#
    .SYNOPSIS
        Validate group name format
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )

    # Group name requirements
    if ([string]::IsNullOrWhiteSpace($Name)) {
        return @{ Valid = $false; Message = "Group name cannot be empty" }
    }

    if ($Name.Length -gt 256) {
        return @{ Valid = $false; Message = "Group name cannot exceed 256 characters" }
    }

    # Check for invalid characters
    $invalidChars = @('<', '>', ';', ':', '\', '/', '"', '|', '?', '*')
    foreach ($char in $invalidChars) {
        if ($Name.Contains($char)) {
            return @{ Valid = $false; Message = "Group name cannot contain: $($invalidChars -join ' ')" }
        }
    }

    return @{ Valid = $true; Message = "Valid" }
}

function Test-MailNicknameValid {
    <#
    .SYNOPSIS
        Validate mail nickname format
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$MailNickname
    )

    if ([string]::IsNullOrWhiteSpace($MailNickname)) {
        return @{ Valid = $false; Message = "Mail nickname cannot be empty" }
    }

    if ($MailNickname.Length -gt 64) {
        return @{ Valid = $false; Message = "Mail nickname cannot exceed 64 characters" }
    }

    # Must start with alphanumeric
    if ($MailNickname -notmatch "^[a-zA-Z0-9]") {
        return @{ Valid = $false; Message = "Mail nickname must start with a letter or number" }
    }

    # Only alphanumeric, hyphens, underscores
    if ($MailNickname -notmatch "^[a-zA-Z0-9_-]+$") {
        return @{ Valid = $false; Message = "Mail nickname can only contain letters, numbers, hyphens, and underscores" }
    }

    return @{ Valid = $true; Message = "Valid" }
}

#endregion

#region Data Export Functions

function Export-ToCsv {
    <#
    .SYNOPSIS
        Export data to CSV with proper formatting
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [array]$Data,

        [Parameter(Mandatory)]
        [string]$FilePath,

        [switch]$Append
    )

    try {
        $params = @{
            Path = $FilePath
            NoTypeInformation = $true
            Encoding = "UTF8"
        }

        if ($Append -and (Test-Path $FilePath)) {
            $Data | Export-Csv @params -Append
        }
        else {
            $Data | Export-Csv @params
        }

        Write-PIMBuddyLog -Message "Exported data to: $FilePath" -Level "Success"
        return $true
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to export CSV" -Level "Error" -Exception $_.Exception
        return $false
    }
}

function Import-FromCsv {
    <#
    .SYNOPSIS
        Import data from CSV with validation
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [string[]]$RequiredColumns
    )

    if (-not (Test-Path $FilePath)) {
        return @{
            Success = $false
            Data = $null
            Message = "File not found: $FilePath"
        }
    }

    try {
        $data = Import-Csv -Path $FilePath -Encoding UTF8

        if ($RequiredColumns) {
            $headers = $data[0].PSObject.Properties.Name
            $missingColumns = $RequiredColumns | Where-Object { $_ -notin $headers }

            if ($missingColumns) {
                return @{
                    Success = $false
                    Data = $null
                    Message = "Missing required columns: $($missingColumns -join ', ')"
                }
            }
        }

        Write-PIMBuddyLog -Message "Imported $($data.Count) records from: $FilePath" -Level "Success"
        return @{
            Success = $true
            Data = $data
            Message = "Imported $($data.Count) records"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to import CSV" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Data = $null
            Message = "Failed to parse CSV: $($_.Exception.Message)"
        }
    }
}

function Export-ToJson {
    <#
    .SYNOPSIS
        Export configuration to JSON
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        $Data,

        [Parameter(Mandatory)]
        [string]$FilePath
    )

    try {
        $json = $Data | ConvertTo-Json -Depth 20
        Set-Content -Path $FilePath -Value $json -Encoding UTF8

        Write-PIMBuddyLog -Message "Exported configuration to: $FilePath" -Level "Success"
        return $true
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to export JSON" -Level "Error" -Exception $_.Exception
        return $false
    }
}

function Import-FromJson {
    <#
    .SYNOPSIS
        Import configuration from JSON
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$FilePath
    )

    if (-not (Test-Path $FilePath)) {
        return @{
            Success = $false
            Data = $null
            Message = "File not found: $FilePath"
        }
    }

    try {
        $data = Get-Content -Path $FilePath -Raw | ConvertFrom-Json

        Write-PIMBuddyLog -Message "Imported configuration from: $FilePath" -Level "Success"
        return @{
            Success = $true
            Data = $data
            Message = "Configuration imported successfully"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to import JSON" -Level "Error" -Exception $_.Exception
        return @{
            Success = $false
            Data = $null
            Message = "Failed to parse JSON: $($_.Exception.Message)"
        }
    }
}

#endregion

#region Duration Helpers

function ConvertTo-IsoDuration {
    <#
    .SYNOPSIS
        Convert hours to ISO 8601 duration format (PT#H)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [int]$Hours
    )

    return "PT${Hours}H"
}

function ConvertFrom-IsoDuration {
    <#
    .SYNOPSIS
        Convert ISO 8601 duration to hours
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [AllowNull()]
        [AllowEmptyString()]
        [string]$Duration
    )

    if ([string]::IsNullOrEmpty($Duration)) {
        return 8  # Default
    }

    $totalHours = 0

    # Handle combined formats like PT4H30M
    if ($Duration -match "PT(?:(\d+)H)?(?:(\d+)M)?") {
        if ($Matches[1]) {
            $totalHours += [int]$Matches[1]
        }
        if ($Matches[2]) {
            $totalHours += [math]::Ceiling([int]$Matches[2] / 60)
        }
        if ($totalHours -gt 0) {
            return $totalHours
        }
    }

    # Simple hour format
    if ($Duration -match "PT(\d+)H") {
        return [int]$Matches[1]
    }

    # Simple minute format
    if ($Duration -match "PT(\d+)M") {
        return [math]::Ceiling([int]$Matches[1] / 60)
    }

    return 8  # Default
}

function ConvertTo-DaysTimeSpan {
    <#
    .SYNOPSIS
        Convert days to ISO 8601 duration format (P#D)
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [int]$Days
    )

    return "P${Days}D"
}

#endregion

# Export all functions
Export-ModuleMember -Function *
