#Requires -Version 7.0
<#
.SYNOPSIS
    PIMBuddy - Privileged Identity Management Tool for Microsoft Entra ID
.DESCRIPTION
    A PowerShell WPF application for managing Microsoft Entra ID Privileged Identity Management (PIM).
    Create, configure, and deploy PIM Groups and Policies with a modern, intuitive interface.
.NOTES
    Author: PIMBuddy
    Version: 1.0.0
    Required: PowerShell 7+, Microsoft.Graph PowerShell SDK
#>

param(
    [switch]$Verbose,
    [switch]$Debug
)

$ErrorActionPreference = "Stop"

# Get script root
$script:AppRoot = $PSScriptRoot

#region Assembly Loading

# Load required assemblies for WPF
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

#endregion

#region Module Loading

# Import custom modules
$modulesPath = Join-Path $script:AppRoot "Modules"

# Define module loading function
function Import-PIMBuddyModule {
    param([string]$ModulePath, [string]$ModuleName)

    if (Test-Path $ModulePath) {
        try {
            # Remove existing module if loaded
            $existingModule = Get-Module -Name ([System.IO.Path]::GetFileNameWithoutExtension($ModuleName)) -ErrorAction SilentlyContinue
            if ($existingModule) {
                Remove-Module $existingModule -Force -ErrorAction SilentlyContinue
            }

            # Import with Global scope
            $null = Import-Module $ModulePath -Force -Global -DisableNameChecking -PassThru -WarningAction SilentlyContinue
            Write-Host "Loaded module: $ModuleName" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "Warning: Could not load $ModuleName - $($_.Exception.Message)" -ForegroundColor Yellow
            return $false
        }
    }
    return $false
}

# Load all modules
$allModules = @(
    "Helpers.psm1",
    "Authentication.psm1",
    "GroupManagement.psm1",
    "PolicyManagement.psm1",
    "RoleManagement.psm1",
    "Templates.psm1",
    "AdvancedFeatures.psm1"
)

foreach ($module in $allModules) {
    $modulePath = Join-Path $modulesPath $module
    Import-PIMBuddyModule -ModulePath $modulePath -ModuleName $module
}

#endregion

#region Prerequisite Check

Write-Host "`nChecking prerequisites..." -ForegroundColor Cyan

# Check for required Graph modules
$requiredModules = @(
    "Microsoft.Graph.Authentication",
    "Microsoft.Graph.Identity.Governance",
    "Microsoft.Graph.Groups",
    "Microsoft.Graph.Users",
    "Microsoft.Graph.Identity.DirectoryManagement"
)

# PERFORMANCE: Get all available modules once instead of calling Get-Module for each required module
$availableModules = Get-Module -ListAvailable -Name "Microsoft.Graph.*" | Select-Object -ExpandProperty Name -Unique
$missingModules = $requiredModules | Where-Object { $_ -notin $availableModules }

if ($missingModules.Count -gt 0) {
    Write-Host "`nMissing required modules: $($missingModules -join ', ')" -ForegroundColor Red
    Write-Host "`nPlease install missing modules using:" -ForegroundColor Yellow
    foreach ($reqModule in $missingModules) {
        Write-Host "  Install-Module $reqModule -Force" -ForegroundColor White
    }
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "All prerequisites met!" -ForegroundColor Green

# Now enable strict mode after modules are loaded
Set-StrictMode -Version Latest

#endregion

#region Initialize Logging

Initialize-PIMBuddyLogging -EnableVerbose:$Verbose
Write-PIMBuddyLog -Message "PIMBuddy starting..." -Level "Info"

#endregion

#region Load Settings

$script:Settings = Get-PIMBuddySettings
Write-PIMBuddyLog -Message "Settings loaded" -Level "Debug"

#endregion

#region Load XAML

function Load-Xaml {
    param(
        [string]$XamlPath
    )

    try {
        $xamlContent = Get-Content -Path $XamlPath -Raw

        # Remove x:Class attribute for PowerShell compatibility
        $xamlContent = $xamlContent -replace 'x:Class="[^"]*"', ''

        # Create XML reader
        $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xamlContent))

        # Parse XAML
        $window = [System.Windows.Markup.XamlReader]::Load($reader)

        return $window
    }
    catch {
        Write-PIMBuddyLog -Message "Failed to load XAML: $XamlPath" -Level "Error" -Exception $_.Exception
        throw
    }
}

#endregion

#region WPF Dialog Helpers

function Show-SelectionDialog {
    <#
    .SYNOPSIS
        Shows a modern WPF dialog for selecting from a list of items
    .PARAMETER Title
        Dialog title
    .PARAMETER Message
        Instructions shown above the list
    .PARAMETER Items
        Array of items to select from (can be strings or objects)
    .PARAMETER DisplayProperty
        If items are objects, which property to display
    .PARAMETER AllowMultiple
        Allow selecting multiple items
    .PARAMETER Owner
        Parent window
    #>
    param(
        [string]$Title = "Select Item",
        [string]$Message = "Please select an item:",
        [array]$Items,
        [string]$DisplayProperty,
        [switch]$AllowMultiple,
        [System.Windows.Window]$Owner
    )

    if (-not $Items -or $Items.Count -eq 0) {
        return $null
    }

    # Build XAML for the dialog
    $xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="$Title"
        WindowStartupLocation="CenterOwner"
        SizeToContent="Height"
        Width="420" MinHeight="200" MaxHeight="500"
        WindowStyle="SingleBorderWindow"
        ResizeMode="NoResize"
        Background="{DynamicResource BackgroundBrush}">
    <Window.Resources>
        <SolidColorBrush x:Key="BackgroundBrush" Color="#FAFAFA"/>
        <SolidColorBrush x:Key="CardBrush" Color="#FFFFFF"/>
        <SolidColorBrush x:Key="TextBrush" Color="#323130"/>
        <SolidColorBrush x:Key="BorderBrush" Color="#E1E1E1"/>
        <SolidColorBrush x:Key="AccentBrush" Color="#0078D4"/>
        <SolidColorBrush x:Key="HoverBrush" Color="#F3F2F1"/>
    </Window.Resources>
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <TextBlock Grid.Row="0" Text="$([System.Security.SecurityElement]::Escape($Message))"
                   TextWrapping="Wrap" Margin="0,0,0,15" FontSize="13"
                   Foreground="{DynamicResource TextBrush}"/>

        <ListBox x:Name="ItemsList" Grid.Row="1"
                 BorderBrush="{DynamicResource BorderBrush}" BorderThickness="1"
                 Background="{DynamicResource CardBrush}"
                 Padding="5" Margin="0,0,0,15"
                 SelectionMode="$( if ($AllowMultiple) { 'Extended' } else { 'Single' } )">
            <ListBox.ItemContainerStyle>
                <Style TargetType="ListBoxItem">
                    <Setter Property="Padding" Value="10,8"/>
                    <Setter Property="Cursor" Value="Hand"/>
                    <Setter Property="Template">
                        <Setter.Value>
                            <ControlTemplate TargetType="ListBoxItem">
                                <Border x:Name="Bd" Background="Transparent" Padding="{TemplateBinding Padding}" CornerRadius="4">
                                    <ContentPresenter/>
                                </Border>
                                <ControlTemplate.Triggers>
                                    <Trigger Property="IsMouseOver" Value="True">
                                        <Setter TargetName="Bd" Property="Background" Value="{DynamicResource HoverBrush}"/>
                                    </Trigger>
                                    <Trigger Property="IsSelected" Value="True">
                                        <Setter TargetName="Bd" Property="Background" Value="{DynamicResource AccentBrush}"/>
                                        <Setter Property="Foreground" Value="White"/>
                                    </Trigger>
                                </ControlTemplate.Triggers>
                            </ControlTemplate>
                        </Setter.Value>
                    </Setter>
                </Style>
            </ListBox.ItemContainerStyle>
        </ListBox>

        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="CancelButton" Content="Cancel" Width="90" Height="32" Margin="0,0,10,0"
                    Background="{DynamicResource CardBrush}" BorderBrush="{DynamicResource BorderBrush}"
                    Foreground="{DynamicResource TextBrush}" Cursor="Hand"/>
            <Button x:Name="OkButton" Content="Select" Width="90" Height="32"
                    Background="{DynamicResource AccentBrush}" BorderBrush="{DynamicResource AccentBrush}"
                    Foreground="White" Cursor="Hand" IsDefault="True"/>
        </StackPanel>
    </Grid>
</Window>
"@

    try {
        $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
        $dialog = [System.Windows.Markup.XamlReader]::Load($reader)

        # Apply theme if dark mode
        if ($script:CurrentTheme -eq "Dark") {
            $dialog.Resources["BackgroundBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#1E1E1E"))
            $dialog.Resources["CardBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#2D2D2D"))
            $dialog.Resources["TextBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#FFFFFF"))
            $dialog.Resources["BorderBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#404040"))
            $dialog.Resources["HoverBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#3D3D3D"))
        }

        if ($Owner) { $dialog.Owner = $Owner }

        $listBox = $dialog.FindName("ItemsList")
        $okButton = $dialog.FindName("OkButton")
        $cancelButton = $dialog.FindName("CancelButton")

        # Populate items
        foreach ($item in $Items) {
            $displayText = if ($DisplayProperty -and $item.$DisplayProperty) {
                $item.$DisplayProperty
            } else {
                $item.ToString()
            }
            $listBoxItem = [System.Windows.Controls.ListBoxItem]::new()
            $listBoxItem.Content = $displayText
            $listBoxItem.Tag = $item
            $null = $listBox.Items.Add($listBoxItem)
        }

        if ($listBox.Items.Count -gt 0) {
            $listBox.SelectedIndex = 0
        }

        # Double-click to select
        $listBox.Add_MouseDoubleClick({
            param($s, $e)
            if ($listBox.SelectedItem) {
                $dialog.Tag = "OK"
                $dialog.Close()
            }
        })

        $okButton.Add_Click({
            $dialog.Tag = "OK"
            $dialog.Close()
        })

        $cancelButton.Add_Click({
            $dialog.Tag = "Cancel"
            $dialog.Close()
        })

        # Add Escape key to close
        $dialog.Add_KeyDown({
            param($s, $e)
            if ($e.Key -eq [System.Windows.Input.Key]::Escape) {
                $dialog.Tag = "Cancel"
                $dialog.Close()
            }
        })

        $null = $dialog.ShowDialog()

        if ($dialog.Tag -eq "OK" -and $listBox.SelectedItem) {
            if ($AllowMultiple) {
                return $listBox.SelectedItems | ForEach-Object { $_.Tag }
            }
            return $listBox.SelectedItem.Tag
        }

        return $null
    }
    catch {
        Write-PIMBuddyLog -Message "Selection dialog error: $($_.Exception.Message)" -Level "Error"
        return $null
    }
}

function Show-ChoiceDialog {
    <#
    .SYNOPSIS
        Shows a modern WPF dialog for choosing from options (replaces numbered menu InputBox)
    .PARAMETER Title
        Dialog title
    .PARAMETER Message
        Instructions shown above the options
    .PARAMETER Choices
        Array of hashtables with Label and optional Description
    .PARAMETER Owner
        Parent window
    #>
    param(
        [string]$Title = "Choose Action",
        [string]$Message = "Please select an option:",
        [array]$Choices,
        [System.Windows.Window]$Owner
    )

    if (-not $Choices -or $Choices.Count -eq 0) {
        return $null
    }

    # Build radio button XAML for each choice
    $radioButtonsXaml = ""
    $index = 0
    foreach ($choice in $Choices) {
        $label = [System.Security.SecurityElement]::Escape($choice.Label)
        $desc = if ($choice.Description) { [System.Security.SecurityElement]::Escape($choice.Description) } else { "" }
        $isChecked = if ($index -eq 0) { 'IsChecked="True"' } else { '' }

        $descXaml = ""
        if ($desc) {
            $descXaml = '<TextBlock Text="' + $desc + '" FontSize="11" Foreground="{DynamicResource SecondaryTextBrush}" TextWrapping="Wrap" Margin="0,2,0,0"/>'
        }

        $radioButtonsXaml += @"
            <RadioButton x:Name="Option$index" GroupName="Choices" $isChecked Margin="0,0,0,8" Cursor="Hand">
                <StackPanel Margin="5,0,0,0">
                    <TextBlock Text="$label" FontWeight="SemiBold" FontSize="13" Foreground="{DynamicResource TextBrush}"/>
                    $descXaml
                </StackPanel>
            </RadioButton>
"@
        $index++
    }

    $xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="$Title"
        WindowStartupLocation="CenterOwner"
        SizeToContent="Height"
        Width="400" MinHeight="150" MaxHeight="500"
        WindowStyle="SingleBorderWindow"
        ResizeMode="NoResize"
        Background="{DynamicResource BackgroundBrush}">
    <Window.Resources>
        <SolidColorBrush x:Key="BackgroundBrush" Color="#FAFAFA"/>
        <SolidColorBrush x:Key="CardBrush" Color="#FFFFFF"/>
        <SolidColorBrush x:Key="TextBrush" Color="#323130"/>
        <SolidColorBrush x:Key="SecondaryTextBrush" Color="#605E5C"/>
        <SolidColorBrush x:Key="BorderBrush" Color="#E1E1E1"/>
        <SolidColorBrush x:Key="AccentBrush" Color="#0078D4"/>
    </Window.Resources>
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <TextBlock Grid.Row="0" Text="$([System.Security.SecurityElement]::Escape($Message))"
                   TextWrapping="Wrap" Margin="0,0,0,15" FontSize="13"
                   Foreground="{DynamicResource TextBrush}"/>

        <Border Grid.Row="1" Background="{DynamicResource CardBrush}"
                BorderBrush="{DynamicResource BorderBrush}" BorderThickness="1"
                CornerRadius="4" Padding="15" Margin="0,0,0,15">
            <StackPanel x:Name="ChoicesPanel">
                $radioButtonsXaml
            </StackPanel>
        </Border>

        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="CancelButton" Content="Cancel" Width="90" Height="32" Margin="0,0,10,0"
                    Background="{DynamicResource CardBrush}" BorderBrush="{DynamicResource BorderBrush}"
                    Foreground="{DynamicResource TextBrush}" Cursor="Hand"/>
            <Button x:Name="OkButton" Content="OK" Width="90" Height="32"
                    Background="{DynamicResource AccentBrush}" BorderBrush="{DynamicResource AccentBrush}"
                    Foreground="White" Cursor="Hand" IsDefault="True"/>
        </StackPanel>
    </Grid>
</Window>
"@

    try {
        $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
        $dialog = [System.Windows.Markup.XamlReader]::Load($reader)

        # Apply theme if dark mode
        if ($script:CurrentTheme -eq "Dark") {
            $dialog.Resources["BackgroundBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#1E1E1E"))
            $dialog.Resources["CardBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#2D2D2D"))
            $dialog.Resources["TextBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#FFFFFF"))
            $dialog.Resources["SecondaryTextBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#A0A0A0"))
            $dialog.Resources["BorderBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#404040"))
        }

        if ($Owner) { $dialog.Owner = $Owner }

        $okButton = $dialog.FindName("OkButton")
        $cancelButton = $dialog.FindName("CancelButton")

        $null = $okButton.Add_Click({
            $dialog.Tag = "OK"
            $null = $dialog.Close()
        })

        $null = $cancelButton.Add_Click({
            $dialog.Tag = "Cancel"
            $null = $dialog.Close()
        })

        # Add Escape key to close
        $null = $dialog.Add_KeyDown({
            param($s, $e)
            if ($e.Key -eq [System.Windows.Input.Key]::Escape) {
                $dialog.Tag = "Cancel"
                $null = $dialog.Close()
            }
        })

        $null = $dialog.ShowDialog()

        if ($dialog.Tag -eq "OK") {
            for ($i = 0; $i -lt $Choices.Count; $i++) {
                $radio = $dialog.FindName("Option$i")
                if ($radio) {
                    # Explicitly check the nullable boolean - WPF IsChecked is Nullable<bool>
                    $isChecked = $radio.IsChecked
                    if ($isChecked -eq $true) {
                        return [int]$i
                    }
                }
            }
        }

        return $null
    }
    catch {
        Write-PIMBuddyLog -Message "Choice dialog error: $($_.Exception.Message)" -Level "Error"
        return $null
    }
}

function Show-InputDialog {
    <#
    .SYNOPSIS
        Shows a modern WPF dialog for text input
    .PARAMETER Title
        Dialog title
    .PARAMETER Message
        Instructions shown above the input
    .PARAMETER DefaultValue
        Initial value in the text box
    .PARAMETER IsNumeric
        Only allow numeric input
    .PARAMETER MinValue
        Minimum numeric value
    .PARAMETER MaxValue
        Maximum numeric value
    .PARAMETER Owner
        Parent window
    #>
    param(
        [string]$Title = "Input",
        [string]$Message = "Please enter a value:",
        [string]$DefaultValue = "",
        [switch]$IsNumeric,
        [int]$MinValue = 0,
        [int]$MaxValue = 100,
        [System.Windows.Window]$Owner
    )

    $xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="$Title"
        WindowStartupLocation="CenterOwner"
        SizeToContent="Height"
        Width="380" MinHeight="150"
        WindowStyle="SingleBorderWindow"
        ResizeMode="NoResize"
        Background="{DynamicResource BackgroundBrush}">
    <Window.Resources>
        <SolidColorBrush x:Key="BackgroundBrush" Color="#FAFAFA"/>
        <SolidColorBrush x:Key="CardBrush" Color="#FFFFFF"/>
        <SolidColorBrush x:Key="TextBrush" Color="#323130"/>
        <SolidColorBrush x:Key="BorderBrush" Color="#E1E1E1"/>
        <SolidColorBrush x:Key="AccentBrush" Color="#0078D4"/>
    </Window.Resources>
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <TextBlock Grid.Row="0" Text="$([System.Security.SecurityElement]::Escape($Message))"
                   TextWrapping="Wrap" Margin="0,0,0,15" FontSize="13"
                   Foreground="{DynamicResource TextBrush}"/>

        <TextBox x:Name="InputBox" Grid.Row="1"
                 Text="$([System.Security.SecurityElement]::Escape($DefaultValue))"
                 Height="32" FontSize="13" Padding="8,5"
                 Background="{DynamicResource CardBrush}"
                 BorderBrush="{DynamicResource BorderBrush}"
                 Foreground="{DynamicResource TextBrush}"
                 Margin="0,0,0,15"/>

        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="CancelButton" Content="Cancel" Width="90" Height="32" Margin="0,0,10,0"
                    Background="{DynamicResource CardBrush}" BorderBrush="{DynamicResource BorderBrush}"
                    Foreground="{DynamicResource TextBrush}" Cursor="Hand"/>
            <Button x:Name="OkButton" Content="OK" Width="90" Height="32"
                    Background="{DynamicResource AccentBrush}" BorderBrush="{DynamicResource AccentBrush}"
                    Foreground="White" Cursor="Hand" IsDefault="True"/>
        </StackPanel>
    </Grid>
</Window>
"@

    try {
        $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
        $dialog = [System.Windows.Markup.XamlReader]::Load($reader)

        # Apply theme if dark mode
        if ($script:CurrentTheme -eq "Dark") {
            $dialog.Resources["BackgroundBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#1E1E1E"))
            $dialog.Resources["CardBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#2D2D2D"))
            $dialog.Resources["TextBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#FFFFFF"))
            $dialog.Resources["BorderBrush"] = [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.ColorConverter]::ConvertFromString("#404040"))
        }

        if ($Owner) { $dialog.Owner = $Owner }

        $inputBox = $dialog.FindName("InputBox")
        $okButton = $dialog.FindName("OkButton")
        $cancelButton = $dialog.FindName("CancelButton")

        # Select all text on focus (suppress output to prevent it from being returned)
        $null = $inputBox.Add_GotFocus({ $null = $inputBox.SelectAll() })
        $null = $inputBox.Focus()
        $null = $inputBox.SelectAll()

        $null = $okButton.Add_Click({
            $value = $inputBox.Text.Trim()
            if ($IsNumeric) {
                if ($value -match '^\d+$') {
                    $num = [int]$value
                    if ($num -ge $MinValue -and $num -le $MaxValue) {
                        $dialog.Tag = "OK"
                        $null = $dialog.Close()
                    }
                }
            }
            else {
                $dialog.Tag = "OK"
                $null = $dialog.Close()
            }
        })

        $null = $cancelButton.Add_Click({
            $dialog.Tag = "Cancel"
            $null = $dialog.Close()
        })

        # Add Escape key to close
        $null = $dialog.Add_KeyDown({
            param($s, $e)
            if ($e.Key -eq [System.Windows.Input.Key]::Escape) {
                $dialog.Tag = "Cancel"
                $null = $dialog.Close()
            }
        })

        $null = $dialog.ShowDialog()

        if ($dialog.Tag -eq "OK") {
            # Ensure we return a proper string value
            $result = $inputBox.Text
            if ($null -eq $result) {
                return ""
            }
            return [string]$result.Trim()
        }

        return $null
    }
    catch {
        Write-PIMBuddyLog -Message "Input dialog error: $($_.Exception.Message)" -Level "Error"
        return $null
    }
}

#endregion

#region Theme Management

$script:CurrentTheme = $script:Settings.Theme

function Set-Theme {
    param(
        [Parameter(Mandatory)]
        [ValidateSet("Light", "Dark")]
        [string]$Theme,

        [System.Windows.Window]$Window
    )

    $script:CurrentTheme = $Theme

    if (-not $Window) { return }

    # Define theme colors
    $themeColors = @{
        "Light" = @{
            "BackgroundBrush" = "#FAFAFA"
            "CardBrush" = "#FFFFFF"
            "CardHoverBrush" = "#F5F5F5"
            "TextBrush" = "#323130"
            "TextSecondaryBrush" = "#605E5C"
            "TextMutedBrush" = "#A19F9D"
            "BorderBrush" = "#E1E1E1"
            "NavBackgroundBrush" = "#F3F2F1"
            "NavSelectedBrush" = "#DEECF9"
            "StatusBarBrush" = "#F3F2F1"
            "InputBackgroundBrush" = "#FFFFFF"
        }
        "Dark" = @{
            "BackgroundBrush" = "#1E1E1E"
            "CardBrush" = "#2D2D2D"
            "CardHoverBrush" = "#383838"
            "TextBrush" = "#FFFFFF"
            "TextSecondaryBrush" = "#D2D0CE"
            "TextMutedBrush" = "#8A8886"
            "BorderBrush" = "#404040"
            "NavBackgroundBrush" = "#252526"
            "NavSelectedBrush" = "#37373D"
            "StatusBarBrush" = "#007ACC"
            "InputBackgroundBrush" = "#3C3C3C"
        }
    }

    $colors = $themeColors[$Theme]
    $resources = $Window.Resources

    foreach ($key in $colors.Keys) {
        if ($resources.Contains($key)) {
            $brush = [System.Windows.Media.BrushConverter]::new().ConvertFromString($colors[$key])
            $resources[$key] = $brush
        }
    }

    # Update theme toggle button icon
    $themeButton = $Window.FindName("ThemeToggleButton")
    if ($themeButton) {
        $themeButton.Content = if ($Theme -eq "Light") { [char]0xE793 } else { [char]0xE706 }
    }

    # Save preference
    $script:Settings.Theme = $Theme
    Save-PIMBuddySettings -Settings $script:Settings

    Write-PIMBuddyLog -Message "Theme changed to: $Theme" -Level "Debug"
}

#endregion

#region Navigation

function Set-ActivePage {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,

        [Parameter(Mandatory)]
        [string]$PageName
    )

    # Hide all pages
    $pages = @("DashboardPage", "GroupsPage", "PoliciesPage", "RolesPage",
               "TemplatesPage", "ExportPage", "SettingsPage")

    foreach ($page in $pages) {
        $pageElement = $Window.FindName($page)
        if ($pageElement) {
            $pageElement.Visibility = [System.Windows.Visibility]::Collapsed
        }
    }

    # Show selected page
    $selectedPage = $Window.FindName($PageName)
    if ($selectedPage) {
        $selectedPage.Visibility = [System.Windows.Visibility]::Visible
    }

    Write-PIMBuddyLog -Message "Navigated to: $PageName" -Level "Debug"
}

#endregion

#region Connection Management

$script:IsConnected = $false

function Update-ConnectionUI {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,

        [bool]$Connected,

        [string]$TenantName = "",

        [string]$UserName = ""
    )

    # Update indicator
    $indicator = $Window.FindName("ConnectionIndicator")
    if ($indicator) {
        $color = if ($Connected) { "#107C10" } else { "#D13438" }
        $indicator.Fill = [System.Windows.Media.BrushConverter]::new().ConvertFromString($color)
    }

    # Update text
    $text = $Window.FindName("ConnectionText")
    if ($text) {
        if ($Connected) {
            $text.Text = "Connected: $TenantName | User: $UserName"
        }
        else {
            $text.Text = "Not Connected"
        }
    }

    # Update status bar info
    $statusInfo = $Window.FindName("StatusBarInfo")
    if ($statusInfo) {
        if ($Connected) {
            $envName = $script:Settings.CloudEnvironment
            $statusInfo.Text = "Environment: $envName | PowerShell $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"
        }
        else {
            $statusInfo.Text = "PowerShell $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"
        }
    }

    # Update connect button
    $connectButton = $Window.FindName("ConnectButton")
    $connectButtonText = $Window.FindName("ConnectButtonText")
    if ($connectButton -and $connectButtonText) {
        if ($Connected) {
            $connectButtonText.Text = "Disconnect"
            $connectButton.Background = [System.Windows.Media.BrushConverter]::new().ConvertFromString("#D13438")
        }
        else {
            $connectButtonText.Text = "Connect"
            $connectButton.Background = $Window.Resources["PrimaryBrush"]
        }
    }

    $script:IsConnected = $Connected
}

function Connect-ToGraph {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    Show-PIMBuddyProgress -Window $Window -Message "Connecting to Microsoft Graph..."

    try {
        $cloudEnv = $script:Settings.CloudEnvironment
        $result = Connect-PIMBuddy -CloudEnvironment $cloudEnv

        if ($result.Success) {
            # Safely get tenant and user info with null checks
            $tenantName = if ($result.Tenant) { $result.Tenant.DefaultDomain } else { "Unknown Tenant" }
            $userName = if ($result.User) { $result.User.UserPrincipalName } else { "Unknown User" }
            $tenantDisplayName = if ($result.Tenant) { $result.Tenant.DisplayName } else { $tenantName }

            Update-ConnectionUI -Window $Window -Connected $true `
                -TenantName $tenantName `
                -UserName $userName

            Show-PIMBuddyToast -Window $Window -Message "Connected to $tenantDisplayName" -Type "Success"

            # Refresh data
            Refresh-DashboardData -Window $Window
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Connection failed: $($result.Error)" -Type "Error" -DurationMs 5000
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Connection error: $($_.Exception.Message)" -Type "Error" -DurationMs 5000
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Disconnect-FromGraph {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    $result = Disconnect-PIMBuddy
    Update-ConnectionUI -Window $Window -Connected $false
    Show-PIMBuddyToast -Window $Window -Message "Disconnected" -Type "Info"
}

#endregion

#region Data Refresh

function Refresh-DashboardData {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) { return }

    Write-PIMBuddyLog -Message "Refreshing dashboard data..." -Level "Debug"

    # Get UI elements
    $statGroups = $Window.FindName("StatTotalGroups")
    $statEligible = $Window.FindName("StatEligibleAssignments")
    $statActive = $Window.FindName("StatActiveAssignments")
    $statPending = $Window.FindName("StatPendingApprovals")

    # Show loading state
    if ($statGroups) { $statGroups.Text = "..." }
    if ($statEligible) { $statEligible.Text = "..." }
    if ($statActive) { $statActive.Text = "..." }
    if ($statPending) { $statPending.Text = "..." }

    try {
        # Fetch statistics from Graph API
        $statsResult = Get-PIMGroupStatistics

        if ($statsResult.Success) {
            $stats = $statsResult.Statistics
            if ($statGroups) { $statGroups.Text = $stats.TotalGroups.ToString() }
            if ($statEligible) { $statEligible.Text = $stats.TotalEligibleAssignments.ToString() }
            if ($statActive) { $statActive.Text = $stats.TotalActiveAssignments.ToString() }
            if ($statPending) { $statPending.Text = $stats.PendingRequests.ToString() }

            Write-PIMBuddyLog -Message "Dashboard: $($stats.TotalGroups) groups, $($stats.TotalEligibleAssignments) eligible, $($stats.TotalActiveAssignments) active" -Level "Info"
        }
        else {
            Write-PIMBuddyLog -Message "Failed to get statistics: $($statsResult.Error)" -Level "Warning"
            if ($statGroups) { $statGroups.Text = "?" }
            if ($statEligible) { $statEligible.Text = "?" }
            if ($statActive) { $statActive.Text = "?" }
            if ($statPending) { $statPending.Text = "?" }
        }

        # Load best practice recommendations
        Refresh-BestPracticeRecommendations -Window $Window
    }
    catch {
        Write-PIMBuddyLog -Message "Error refreshing dashboard" -Level "Error" -Exception $_.Exception
        if ($statGroups) { $statGroups.Text = "!" }
        if ($statEligible) { $statEligible.Text = "!" }
        if ($statActive) { $statActive.Text = "!" }
        if ($statPending) { $statPending.Text = "!" }
    }

    Write-PIMBuddyLog -Message "Dashboard data refreshed" -Level "Debug"
}

function Refresh-BestPracticeRecommendations {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    $recommendationsList = $Window.FindName("RecommendationsList")
    if (-not $recommendationsList) { return }

    try {
        # Clear existing recommendations (except the first static one)
        while ($recommendationsList.Children.Count -gt 1) {
            $recommendationsList.Children.RemoveAt(1)
        }

        # Get best practice violations
        $bpResult = Test-BestPractices

        if ($bpResult.Success -and $bpResult.AllFindings.Count -gt 0) {
            # Remove the "connect to view" message
            $recommendationsList.Children.Clear()

            foreach ($finding in $bpResult.AllFindings | Select-Object -First 5) {
                $border = New-Object System.Windows.Controls.Border
                $border.CornerRadius = [System.Windows.CornerRadius]::new(4)
                $border.Padding = [System.Windows.Thickness]::new(12)
                $border.Margin = [System.Windows.Thickness]::new(0, 0, 0, 8)
                $border.Background = $Window.Resources["NavBackgroundBrush"]

                $grid = New-Object System.Windows.Controls.Grid
                $col1 = New-Object System.Windows.Controls.ColumnDefinition
                $col1.Width = [System.Windows.GridLength]::new(1, [System.Windows.GridUnitType]::Auto)
                $col2 = New-Object System.Windows.Controls.ColumnDefinition
                $col2.Width = [System.Windows.GridLength]::new(1, [System.Windows.GridUnitType]::Star)
                $grid.ColumnDefinitions.Add($col1)
                $grid.ColumnDefinitions.Add($col2)

                # Icon
                $icon = New-Object System.Windows.Controls.TextBlock
                $icon.Text = switch ($finding.Severity) {
                    "high" { [char]0xE783 }    # Error icon
                    "medium" { [char]0xE7BA }  # Warning icon
                    default { [char]0xE946 }   # Info icon
                }
                $icon.FontFamily = [System.Windows.Media.FontFamily]::new("Segoe MDL2 Assets")
                $icon.FontSize = 20
                $icon.Foreground = switch ($finding.Severity) {
                    "high" { [System.Windows.Media.BrushConverter]::new().ConvertFromString("#D13438") }
                    "medium" { [System.Windows.Media.BrushConverter]::new().ConvertFromString("#FFB900") }
                    default { [System.Windows.Media.BrushConverter]::new().ConvertFromString("#0078D4") }
                }
                $icon.VerticalAlignment = [System.Windows.VerticalAlignment]::Top
                $icon.Margin = [System.Windows.Thickness]::new(0, 0, 12, 0)
                [System.Windows.Controls.Grid]::SetColumn($icon, 0)

                # Content
                $content = New-Object System.Windows.Controls.StackPanel
                [System.Windows.Controls.Grid]::SetColumn($content, 1)

                $title = New-Object System.Windows.Controls.TextBlock
                $title.Text = $finding.Title
                $title.FontWeight = [System.Windows.FontWeights]::SemiBold
                $title.Foreground = $Window.Resources["TextBrush"]
                $title.TextWrapping = [System.Windows.TextWrapping]::Wrap

                $desc = New-Object System.Windows.Controls.TextBlock
                $desc.Text = $finding.Description
                $desc.Foreground = $Window.Resources["TextSecondaryBrush"]
                $desc.FontSize = 12
                $desc.TextWrapping = [System.Windows.TextWrapping]::Wrap
                $desc.Margin = [System.Windows.Thickness]::new(0, 4, 0, 0)

                $content.Children.Add($title)
                $content.Children.Add($desc)

                $grid.Children.Add($icon)
                $grid.Children.Add($content)
                $border.Child = $grid

                $recommendationsList.Children.Add($border)
            }

            if ($bpResult.AllFindings.Count -eq 0) {
                Add-NoIssuesMessage -Container $recommendationsList -Window $Window
            }
        }
        elseif ($bpResult.Success) {
            # No issues found
            $recommendationsList.Children.Clear()
            Add-NoIssuesMessage -Container $recommendationsList -Window $Window
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading recommendations" -Level "Warning" -Exception $_.Exception
    }
}

function Add-NoIssuesMessage {
    param($Container, $Window)

    $border = New-Object System.Windows.Controls.Border
    $border.CornerRadius = [System.Windows.CornerRadius]::new(4)
    $border.Padding = [System.Windows.Thickness]::new(12)
    $border.Background = [System.Windows.Media.BrushConverter]::new().ConvertFromString("#107C10")

    $text = New-Object System.Windows.Controls.TextBlock
    $text.Text = "No issues found! Your PIM configuration follows best practices."
    $text.Foreground = [System.Windows.Media.Brushes]::White
    $text.TextWrapping = [System.Windows.TextWrapping]::Wrap

    $border.Child = $text
    $Container.Children.Add($border)
}

#endregion

#region Caching

# Role cache
$script:CachedRoles = $null
$script:RolesCacheTime = $null
$script:RoleCacheValidMinutes = 10  # Extended from 5 to 10 minutes

# Group cache
$script:CachedGroups = $null
$script:GroupsCacheTime = $null
$script:GroupCacheValidMinutes = 5

# Policy cache (per-role/group)
$script:PolicyCache = @{}
$script:PolicyCacheValidMinutes = 3

function Get-CachedRoles {
    param([switch]$ForceRefresh)

    $now = Get-Date
    $cacheValid = $script:CachedRoles -and $script:RolesCacheTime -and
                  (($now - $script:RolesCacheTime).TotalMinutes -lt $script:RoleCacheValidMinutes)

    if ($ForceRefresh -or -not $cacheValid) {
        $result = Get-EntraRoles
        if ($result.Success) {
            $script:CachedRoles = $result.Roles
            $script:RolesCacheTime = $now
            Write-PIMBuddyLog -Message "Role cache refreshed with $($result.Roles.Count) roles" -Level "Debug"
        }
        return $result
    }

    return @{ Success = $true; Roles = $script:CachedRoles }
}

function Get-CachedGroups {
    param([switch]$ForceRefresh)

    $now = Get-Date
    $cacheValid = $script:CachedGroups -and $script:GroupsCacheTime -and
                  (($now - $script:GroupsCacheTime).TotalMinutes -lt $script:GroupCacheValidMinutes)

    if ($ForceRefresh -or -not $cacheValid) {
        $result = Get-PIMGroups
        if ($result.Success) {
            $script:CachedGroups = $result.Groups
            $script:GroupsCacheTime = $now
            Write-PIMBuddyLog -Message "Group cache refreshed with $($result.Groups.Count) groups" -Level "Debug"
        }
        return $result
    }

    return @{ Success = $true; Groups = $script:CachedGroups; Count = $script:CachedGroups.Count }
}

function Get-CachedPolicy {
    param(
        [string]$TargetId,
        [string]$TargetType = "Role",
        [switch]$ForceRefresh
    )

    $cacheKey = "$TargetType-$TargetId"
    $now = Get-Date

    $cached = $script:PolicyCache[$cacheKey]
    $cacheValid = $cached -and $cached.Time -and
                  (($now - $cached.Time).TotalMinutes -lt $script:PolicyCacheValidMinutes)

    if ($ForceRefresh -or -not $cacheValid) {
        $result = if ($TargetType -eq "Role") {
            Get-EntraRolePolicy -RoleDefinitionId $TargetId
        } else {
            Get-PIMGroupPolicy -GroupId $TargetId -AccessId "member"
        }

        if ($result.Success) {
            $script:PolicyCache[$cacheKey] = @{
                Policy = $result
                Time = $now
            }
            Write-PIMBuddyLog -Message "Policy cache refreshed for $cacheKey" -Level "Debug"
        }
        return $result
    }

    return $cached.Policy
}

function Clear-PolicyCache {
    param([string]$TargetId)

    if ($TargetId) {
        # Clear specific target
        $keysToRemove = $script:PolicyCache.Keys | Where-Object { $_ -like "*$TargetId*" }
        foreach ($key in $keysToRemove) {
            $script:PolicyCache.Remove($key)
        }
    } else {
        # Clear all
        $script:PolicyCache = @{}
    }
    Write-PIMBuddyLog -Message "Policy cache cleared" -Level "Debug"
}

#endregion

#region Groups Management UI

$script:CurrentGroups = @()
$script:FilteredGroups = @()

function Refresh-GroupsList {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [switch]$ForceRefresh
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    $dataGrid = $Window.FindName("GroupsDataGrid")
    if (-not $dataGrid) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Loading PIM groups..."

    try {
        # Use cached groups for better performance (don't include member count for speed)
        $result = Get-CachedGroups -ForceRefresh:$ForceRefresh

        if ($result.Success) {
            $script:CurrentGroups = $result.Groups
            $script:FilteredGroups = $result.Groups
            $dataGrid.ItemsSource = $result.Groups
            Write-PIMBuddyLog -Message "Loaded $($result.Count) PIM groups" -Level "Info"

            if ($result.Count -eq 0) {
                Show-PIMBuddyToast -Window $Window -Message "No PIM groups found" -Type "Info"
            }
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load groups: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading groups" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Filter-GroupsList {
    param(
        [System.Windows.Window]$Window,
        [string]$SearchText
    )

    $dataGrid = $Window.FindName("GroupsDataGrid")
    if (-not $dataGrid -or -not $script:CurrentGroups) { return }

    if ([string]::IsNullOrWhiteSpace($SearchText)) {
        $script:FilteredGroups = $script:CurrentGroups
    }
    else {
        $searchLower = $SearchText.ToLower()
        $script:FilteredGroups = $script:CurrentGroups | Where-Object {
            $_.DisplayName.ToLower().Contains($searchLower) -or
            ($_.Description -and $_.Description.ToLower().Contains($searchLower))
        }
    }

    $dataGrid.ItemsSource = $script:FilteredGroups
}

function Show-CreateGroupDialog {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    Write-PIMBuddyLog -Message "Opening Create Group dialog" -Level "Debug"

    # Create dialog using modern WPF input
    $dialogResult = Show-InputDialog -Title "Create PIM Group" `
        -Message "Enter group display name:" `
        -DefaultValue "PIM-" `
        -Owner $Window

    Write-PIMBuddyLog -Message "Dialog result type: $($dialogResult.GetType().Name), value: '$dialogResult'" -Level "Debug"

    # Validate we got a valid string back
    if ($null -eq $dialogResult -or $dialogResult -isnot [string] -or [string]::IsNullOrWhiteSpace($dialogResult)) {
        Write-PIMBuddyLog -Message "Dialog cancelled or empty result" -Level "Debug"
        return
    }

    $groupName = [string]$dialogResult.Trim()

    # Generate mail nickname from name - ensure it's not empty
    $mailNickname = $groupName -replace '[^a-zA-Z0-9_-]', '' -replace '\s+', '-'
    if ([string]::IsNullOrWhiteSpace($mailNickname)) {
        $mailNickname = "PIMGroup-" + (Get-Random -Maximum 9999)
    }
    if ($mailNickname.Length -gt 64) {
        $mailNickname = $mailNickname.Substring(0, 64)
    }

    Write-PIMBuddyLog -Message "Creating group: Name='$groupName', MailNickname='$mailNickname'" -Level "Info"

    Show-PIMBuddyProgress -Window $Window -Message "Creating group: $groupName..."

    try {
        $result = New-PIMGroup -DisplayName $groupName -MailNickname $mailNickname -Description "Created by PIMBuddy" -Confirm:$false

        # Safe property access for logging
        $resultSuccess = $result.Success
        $resultError = if ($result -is [hashtable] -and $result.ContainsKey('Error')) { $result.Error } else { "N/A" }
        $resultGroupId = if ($result -is [hashtable] -and $result.ContainsKey('GroupId')) { $result.GroupId } else { "N/A" }
        Write-PIMBuddyLog -Message "New-PIMGroup result: Success=$resultSuccess, Error=$resultError, GroupId=$resultGroupId" -Level "Debug"

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Group '$groupName' created successfully" -Type "Success"

            # Clear groups cache so fresh data is loaded
            $script:CachedGroups = $null
            $script:GroupsCacheTime = $null

            Refresh-GroupsList -Window $Window
            Refresh-DashboardData -Window $Window
        }
        else {
            $errorMsg = if ($result -is [hashtable] -and $result.ContainsKey('Error') -and $result.Error) { $result.Error } else { "Unknown error - check logs for details" }
            Write-PIMBuddyLog -Message "Group creation failed: $errorMsg" -Level "Error"
            Show-PIMBuddyToast -Window $Window -Message "Failed: $errorMsg" -Type "Error" -DurationMs 5000

            # Also show a message box for visibility
            [System.Windows.MessageBox]::Show(
                "Failed to create group '$groupName':`n`n$errorMsg",
                "Group Creation Failed",
                [System.Windows.MessageBoxButton]::OK,
                [System.Windows.MessageBoxImage]::Error
            )
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-PIMBuddyLog -Message "Exception during group creation: $errorMsg" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Error: $errorMsg" -Type "Error" -DurationMs 5000

        # Also show a message box for visibility
        [System.Windows.MessageBox]::Show(
            "Error creating group '$groupName':`n`n$errorMsg",
            "Group Creation Error",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Error
        )
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Delete-SelectedGroup {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    $dataGrid = $Window.FindName("GroupsDataGrid")
    if (-not $dataGrid -or -not $dataGrid.SelectedItem) {
        Show-PIMBuddyToast -Window $Window -Message "Please select a group first" -Type "Warning"
        return
    }

    $selectedGroup = $dataGrid.SelectedItem
    $groupName = $selectedGroup.DisplayName
    $groupId = $selectedGroup.Id

    $confirm = [System.Windows.MessageBox]::Show(
        "Are you sure you want to delete the group '$groupName'?`n`nThis action cannot be undone.",
        "Confirm Delete",
        [System.Windows.MessageBoxButton]::YesNo,
        [System.Windows.MessageBoxImage]::Warning
    )

    if ($confirm -ne [System.Windows.MessageBoxResult]::Yes) {
        return
    }

    Show-PIMBuddyProgress -Window $Window -Message "Deleting group..."

    try {
        $result = Remove-PIMGroup -GroupId $groupId -Force

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Group '$groupName' deleted" -Type "Success"
            Refresh-GroupsList -Window $Window
            Refresh-DashboardData -Window $Window
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Show-GroupManagementMenu {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    $dataGrid = $Window.FindName("GroupsDataGrid")
    if (-not $dataGrid -or -not $dataGrid.SelectedItem) {
        Show-PIMBuddyToast -Window $Window -Message "Please select a group first" -Type "Warning"
        return
    }

    $selectedGroup = $dataGrid.SelectedItem
    $groupName = $selectedGroup.DisplayName
    $groupId = $selectedGroup.Id

    $choices = @(
        @{ Label = "Add Eligible Member"; Description = "Add a user who can activate membership when needed" }
        @{ Label = "Add Active Member"; Description = "Add a user with permanent active membership" }
        @{ Label = "Remove Member"; Description = "Remove a user's eligible or active assignment" }
        @{ Label = "View Group Details"; Description = "View members, owners, and settings" }
    )

    $choice = Show-ChoiceDialog -Title "Group Actions" `
        -Message "What would you like to do with '$groupName'?" `
        -Choices $choices `
        -Owner $Window

    switch ($choice) {
        0 { Add-GroupMember -Window $Window -GroupId $groupId -GroupName $groupName -AssignmentType "eligible" }
        1 { Add-GroupMember -Window $Window -GroupId $groupId -GroupName $groupName -AssignmentType "active" }
        2 { Remove-GroupMemberDialog -Window $Window -GroupId $groupId -GroupName $groupName }
        3 { Show-GroupDetails -Window $Window -GroupId $groupId }
    }
}

function Remove-GroupMemberDialog {
    param(
        [System.Windows.Window]$Window,
        [string]$GroupId,
        [string]$GroupName
    )

    Show-PIMBuddyProgress -Window $Window -Message "Loading group members..."

    try {
        $details = Get-PIMGroupDetails -GroupId $GroupId

        if (-not $details.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load members: $($details.Error)" -Type "Error"
            return
        }

        # Combine eligible and active assignments for selection
        $allAssignments = @()

        foreach ($assign in $details.EligibleAssignments) {
            $allAssignments += [PSCustomObject]@{
                Display = "$($assign.PrincipalName) (Eligible - $($assign.AccessId))"
                AssignmentId = $assign.Id
                PrincipalId = $assign.PrincipalId
                Type = "eligible"
                AccessId = $assign.AccessId
            }
        }

        foreach ($assign in $details.ActiveAssignments) {
            $allAssignments += [PSCustomObject]@{
                Display = "$($assign.PrincipalName) (Active - $($assign.AccessId))"
                AssignmentId = $assign.Id
                PrincipalId = $assign.PrincipalId
                Type = "active"
                AccessId = $assign.AccessId
            }
        }

        Show-PIMBuddyProgress -Window $Window -Hide

        if ($allAssignments.Count -eq 0) {
            Show-PIMBuddyToast -Window $Window -Message "No members found in this group" -Type "Info"
            return
        }

        $selected = Show-SelectionDialog -Title "Remove Member from $GroupName" `
            -Message "Select the assignment to remove:" `
            -Items $allAssignments `
            -DisplayProperty "Display" `
            -Owner $Window

        if (-not $selected) { return }

        $confirm = [System.Windows.MessageBox]::Show(
            "Are you sure you want to remove this assignment?`n`n$($selected.Display)",
            "Confirm Removal",
            [System.Windows.MessageBoxButton]::YesNo,
            [System.Windows.MessageBoxImage]::Warning
        )

        if ($confirm -ne [System.Windows.MessageBoxResult]::Yes) { return }

        Show-PIMBuddyProgress -Window $Window -Message "Removing assignment..."

        $result = Remove-PIMGroupAssignment -GroupId $GroupId `
            -PrincipalId $selected.PrincipalId `
            -AccessId $selected.AccessId `
            -AssignmentType $selected.Type

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Assignment removed successfully" -Type "Success"
            Refresh-GroupsList -Window $Window
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Add-GroupMember {
    param(
        [System.Windows.Window]$Window,
        [string]$GroupId,
        [string]$GroupName,
        [string]$AssignmentType
    )

    $userSearch = Show-InputDialog -Title "Add $AssignmentType Member to $GroupName" `
        -Message "Enter user's name or email to search:" `
        -DefaultValue "" `
        -Owner $Window

    # Validate we got a valid string back
    if ($null -eq $userSearch -or $userSearch -isnot [string] -or [string]::IsNullOrWhiteSpace($userSearch)) {
        return
    }

    # Ensure it's a proper string for the Search-Users parameter
    $searchString = [string]$userSearch.Trim()
    if ([string]::IsNullOrEmpty($searchString)) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Searching for users..."

    try {
        $searchResult = Search-Users -SearchString $searchString -MaxResults 10

        if (-not $searchResult.Success -or $searchResult.Users.Count -eq 0) {
            Show-PIMBuddyToast -Window $Window -Message "No users found matching '$userSearch'" -Type "Warning"
            Show-PIMBuddyProgress -Window $Window -Hide
            return
        }

        Show-PIMBuddyProgress -Window $Window -Hide

        # Create display items for selection
        $userItems = $searchResult.Users | ForEach-Object {
            [PSCustomObject]@{
                Display = "$($_.DisplayName) ($($_.UserPrincipalName))"
                User = $_
            }
        }

        $selectedItem = Show-SelectionDialog -Title "Select User" `
            -Message "Select a user to add as $AssignmentType member:" `
            -Items $userItems `
            -DisplayProperty "Display" `
            -Owner $Window

        if (-not $selectedItem) { return }

        $selectedUser = $selectedItem.User

        Show-PIMBuddyProgress -Window $Window -Message "Adding $AssignmentType member..."

        if ($AssignmentType -eq "eligible") {
            $result = Add-PIMGroupEligibleMember -GroupId $GroupId -PrincipalId $selectedUser.Id -AccessId "member"
        }
        else {
            $result = Add-PIMGroupActiveMember -GroupId $GroupId -PrincipalId $selectedUser.Id -AccessId "member"
        }

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "$($selectedUser.DisplayName) added as $AssignmentType member" -Type "Success"
            Refresh-GroupsList -Window $Window
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Show-GroupDetails {
    param(
        [System.Windows.Window]$Window,
        [string]$GroupId
    )

    Show-PIMBuddyProgress -Window $Window -Message "Loading group details..."

    try {
        $details = Get-PIMGroupDetails -GroupId $GroupId

        if ($details.Success) {
            $group = $details.Group
            $members = $details.Members
            $owners = $details.Owners
            $eligible = $details.EligibleAssignments
            $active = $details.ActiveAssignments

            $message = "GROUP: $($group.DisplayName)`n"
            $message += "ID: $($group.Id)`n"
            $message += "Description: $($group.Description)`n"
            $message += "Created: $($group.CreatedDateTime)`n`n"

            $message += "OWNERS ($($owners.Count)):`n"
            foreach ($owner in $owners | Select-Object -First 5) {
                $message += "  - $($owner.DisplayName)`n"
            }
            if ($owners.Count -gt 5) { $message += "  ... and $($owners.Count - 5) more`n" }

            $message += "`nMEMBERS ($($members.Count)):`n"
            foreach ($member in $members | Select-Object -First 5) {
                $message += "  - $($member.DisplayName)`n"
            }
            if ($members.Count -gt 5) { $message += "  ... and $($members.Count - 5) more`n" }

            $message += "`nELIGIBLE ASSIGNMENTS ($($eligible.Count)):`n"
            foreach ($assign in $eligible | Select-Object -First 5) {
                $message += "  - $($assign.PrincipalName) ($($assign.AccessId))`n"
            }

            $message += "`nACTIVE ASSIGNMENTS ($($active.Count)):`n"
            foreach ($assign in $active | Select-Object -First 5) {
                $message += "  - $($assign.PrincipalName) ($($assign.AccessId))`n"
            }

            [System.Windows.MessageBox]::Show($message, "Group Details - $($group.DisplayName)", [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Information)
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load details: $($details.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

#endregion

#region Roles Management UI

$script:CurrentRoles = @()
$script:FilteredRoles = @()

function Refresh-RolesList {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [switch]$ForceRefresh
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    $dataGrid = $Window.FindName("RolesDataGrid")
    if (-not $dataGrid) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Loading Entra roles..."

    try {
        $result = Get-CachedRoles -ForceRefresh:$ForceRefresh

        if ($result.Success) {
            $script:CurrentRoles = $result.Roles
            $script:FilteredRoles = $result.Roles
            $dataGrid.ItemsSource = $result.Roles
            Write-PIMBuddyLog -Message "Loaded $($result.Roles.Count) Entra roles" -Level "Info"
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load roles: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading roles" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Filter-RolesList {
    param(
        [System.Windows.Window]$Window,
        [string]$SearchText
    )

    $dataGrid = $Window.FindName("RolesDataGrid")
    if (-not $dataGrid -or -not $script:CurrentRoles) { return }

    if ([string]::IsNullOrWhiteSpace($SearchText)) {
        $script:FilteredRoles = $script:CurrentRoles
    }
    else {
        $searchLower = $SearchText.ToLower()
        $script:FilteredRoles = $script:CurrentRoles | Where-Object {
            $_.DisplayName.ToLower().Contains($searchLower) -or
            ($_.Description -and $_.Description.ToLower().Contains($searchLower))
        }
    }

    $dataGrid.ItemsSource = $script:FilteredRoles
}

function Show-AssignGroupToRoleDialog {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    $dataGrid = $Window.FindName("RolesDataGrid")
    if (-not $dataGrid -or -not $dataGrid.SelectedItem) {
        Show-PIMBuddyToast -Window $Window -Message "Please select a role first" -Type "Warning"
        return
    }

    $selectedRole = $dataGrid.SelectedItem
    $roleName = $selectedRole.DisplayName
    $roleId = $selectedRole.Id

    # Get available PIM groups
    Show-PIMBuddyProgress -Window $Window -Message "Loading PIM groups..."
    $groupsResult = Get-PIMGroups
    Show-PIMBuddyProgress -Window $Window -Hide

    if (-not $groupsResult.Success -or $groupsResult.Groups.Count -eq 0) {
        Show-PIMBuddyToast -Window $Window -Message "No PIM groups available. Create a group first." -Type "Warning"
        return
    }

    # Show group selection dialog
    $selectedGroup = Show-SelectionDialog -Title "Assign Group to Role" `
        -Message "Select a PIM group to assign to role: $roleName" `
        -Items $groupsResult.Groups `
        -DisplayProperty "DisplayName" `
        -Owner $Window

    if (-not $selectedGroup) { return }

    # Ask for assignment type
    $assignTypeChoices = @(
        @{ Label = "Eligible (Recommended)"; Description = "Group members must activate to use the role" }
        @{ Label = "Active"; Description = "Group members have permanent access to the role" }
    )

    $assignChoice = Show-ChoiceDialog -Title "Assignment Type" `
        -Message "How should the group be assigned to '$roleName'?" `
        -Choices $assignTypeChoices `
        -Owner $Window

    if ($null -eq $assignChoice) { return }

    $assignType = if ($assignChoice -eq 1) { "active" } else { "eligible" }

    Show-PIMBuddyProgress -Window $Window -Message "Assigning group to role..."

    try {
        $result = Add-GroupToEntraRole -GroupId $selectedGroup.Id -RoleDefinitionId $roleId -AssignmentType $assignType

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Group '$($selectedGroup.DisplayName)' assigned to '$roleName' as $assignType" -Type "Success"
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

#endregion

#region Policies Management UI

$script:CurrentPolicies = @()
$script:CurrentPolicyTargets = @()
$script:FilteredPolicyTargets = @()
$script:SelectedPolicyTarget = $null

function Refresh-PolicyTargets {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [switch]$ForceRefresh
    )

    if (-not $script:IsConnected) { return }

    $policyList = $Window.FindName("PolicyTargetList")
    if (-not $policyList) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Loading Entra ID Roles..."

    try {
        $targets = @()

        # Load Entra ID Roles using cache
        $rolesResult = Get-CachedRoles -ForceRefresh:$ForceRefresh
        if ($rolesResult.Success) {
            # Show high-privilege roles first, then sort alphabetically
            $highPrivRoles = @(
                "Global Administrator",
                "Privileged Role Administrator",
                "Security Administrator",
                "User Administrator",
                "Exchange Administrator",
                "SharePoint Administrator"
            )

            $sortedRoles = $rolesResult.Roles | Sort-Object {
                $index = $highPrivRoles.IndexOf($_.DisplayName)
                if ($index -ge 0) { $index } else { 100 }
            }, DisplayName

            foreach ($role in $sortedRoles) {
                $targets += [PSCustomObject]@{
                    Id = $role.Id
                    DisplayName = $role.DisplayName
                    Type = "Role"
                    Description = if ($role.DisplayName -in $highPrivRoles) { "High-privilege role" } else { "Directory role" }
                }
            }
        }

        $script:CurrentPolicyTargets = $targets
        $script:FilteredPolicyTargets = $targets
        $policyList.ItemsSource = $targets
        Write-PIMBuddyLog -Message "Loaded $($targets.Count) Entra roles for policy config" -Level "Debug"
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading policy targets" -Level "Error" -Exception $_.Exception
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Filter-PolicyTargets {
    param(
        [System.Windows.Window]$Window,
        [string]$SearchText
    )

    $policyList = $Window.FindName("PolicyTargetList")
    if (-not $policyList -or -not $script:CurrentPolicyTargets) { return }

    if ([string]::IsNullOrWhiteSpace($SearchText)) {
        $script:FilteredPolicyTargets = $script:CurrentPolicyTargets
    }
    else {
        $searchLower = $SearchText.ToLower()
        $script:FilteredPolicyTargets = $script:CurrentPolicyTargets | Where-Object {
            $_.DisplayName.ToLower().Contains($searchLower) -or
            ($_.Description -and $_.Description.ToLower().Contains($searchLower))
        }
    }

    $policyList.ItemsSource = $script:FilteredPolicyTargets
}

function Load-PolicyForTarget {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [string]$TargetId,
        [string]$TargetType,
        [switch]$ForceRefresh
    )

    $script:SelectedPolicyTarget = @{ Id = $TargetId; Type = $TargetType }

    Show-PIMBuddyProgress -Window $Window -Message "Loading policy settings..."

    try {
        # Clear policy cache for this target to ensure fresh data
        if ($ForceRefresh) {
            Clear-PolicyCache -TargetId $TargetId
        }

        # Use role policy function for Entra ID roles - always get fresh data
        $result = Get-EntraRolePolicy -RoleDefinitionId $TargetId

        if ($result.Success) {
            # Update UI with policy settings
            Update-PolicyEditorUI -Window $Window -Policy $result -TargetId $TargetId -TargetType $TargetType
            Write-PIMBuddyLog -Message "Loaded policy for role $TargetId (duration: $($result.Settings.Activation.MaximumDurationHours)h)" -Level "Debug"
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Could not load policy: $($result.Error)" -Type "Warning"
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading policy" -Level "Error" -Exception $_.Exception
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Update-PolicyEditorUI {
    param(
        [System.Windows.Window]$Window,
        $Policy,
        [string]$TargetId,
        [string]$TargetType = "Role"
    )

    $editorPanel = $Window.FindName("PolicyEditorPanel")
    if (-not $editorPanel) { return }

    # Clear previous content
    $editorPanel.Children.Clear()

    $settings = $Policy.Settings

    # Create policy editor content
    $header = New-Object System.Windows.Controls.TextBlock
    $header.Text = "Role Policy Settings"
    $header.FontSize = 20
    $header.FontWeight = [System.Windows.FontWeights]::SemiBold
    $header.Foreground = $Window.Resources["TextBrush"]
    $header.Margin = [System.Windows.Thickness]::new(0, 0, 0, 16)
    $editorPanel.Children.Add($header)

    # Activation Settings Section
    $activationHeader = New-Object System.Windows.Controls.TextBlock
    $activationHeader.Text = "Activation Settings"
    $activationHeader.FontSize = 16
    $activationHeader.FontWeight = [System.Windows.FontWeights]::SemiBold
    $activationHeader.Foreground = $Window.Resources["PrimaryBrush"]
    $activationHeader.Margin = [System.Windows.Thickness]::new(0, 0, 0, 8)
    $editorPanel.Children.Add($activationHeader)

    # Max Duration
    $durationText = New-Object System.Windows.Controls.TextBlock
    $durationText.Text = "• Maximum Duration: $($settings.Activation.MaximumDurationHours) hours"
    $durationText.Foreground = $Window.Resources["TextBrush"]
    $durationText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 0)
    $editorPanel.Children.Add($durationText)

    # MFA
    $mfaIcon = if ($settings.Activation.RequireMfa) { "✓" } else { "✗" }
    $mfaColor = if ($settings.Activation.RequireMfa) { "#107C10" } else { "#D13438" }
    $mfaText = New-Object System.Windows.Controls.TextBlock
    $mfaText.Text = "• Require MFA: $mfaIcon"
    $mfaText.Foreground = [System.Windows.Media.BrushConverter]::new().ConvertFromString($mfaColor)
    $mfaText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 0)
    $editorPanel.Children.Add($mfaText)

    # Justification
    $justIcon = if ($settings.Activation.RequireJustification) { "✓" } else { "✗" }
    $justColor = if ($settings.Activation.RequireJustification) { "#107C10" } else { "#D13438" }
    $justText = New-Object System.Windows.Controls.TextBlock
    $justText.Text = "• Require Justification: $justIcon"
    $justText.Foreground = [System.Windows.Media.BrushConverter]::new().ConvertFromString($justColor)
    $justText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 0)
    $editorPanel.Children.Add($justText)

    # Approval
    $approvalIcon = if ($settings.Activation.RequireApproval) { "✓" } else { "✗" }
    $approvalText = New-Object System.Windows.Controls.TextBlock
    $approvalText.Text = "• Require Approval: $approvalIcon"
    $approvalText.Foreground = $Window.Resources["TextBrush"]
    $approvalText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 16)
    $editorPanel.Children.Add($approvalText)

    # Assignment Settings Section
    $assignHeader = New-Object System.Windows.Controls.TextBlock
    $assignHeader.Text = "Assignment Settings"
    $assignHeader.FontSize = 16
    $assignHeader.FontWeight = [System.Windows.FontWeights]::SemiBold
    $assignHeader.Foreground = $Window.Resources["PrimaryBrush"]
    $assignHeader.Margin = [System.Windows.Thickness]::new(0, 0, 0, 8)
    $editorPanel.Children.Add($assignHeader)

    # Eligible permanent
    $eligPermText = New-Object System.Windows.Controls.TextBlock
    $eligPermText.Text = "• Allow Permanent Eligible: $(if ($settings.EligibleAssignment.AllowPermanent) { 'Yes' } else { 'No' })"
    $eligPermText.Foreground = $Window.Resources["TextBrush"]
    $eligPermText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 0)
    $editorPanel.Children.Add($eligPermText)

    # Active permanent
    $activePermText = New-Object System.Windows.Controls.TextBlock
    $activePermText.Text = "• Allow Permanent Active: $(if ($settings.ActiveAssignment.AllowPermanent) { 'Yes' } else { 'No' })"
    $activePermText.Foreground = $Window.Resources["TextBrush"]
    $activePermText.Margin = [System.Windows.Thickness]::new(0, 4, 0, 16)
    $editorPanel.Children.Add($activePermText)

    # Quick Configure Button
    $configButton = New-Object System.Windows.Controls.Button
    $configButton.Content = "Quick Configure..."
    $configButton.Style = $Window.Resources["PrimaryButton"]
    $configButton.Margin = [System.Windows.Thickness]::new(0, 8, 0, 0)
    $configButton.Tag = $TargetId

    $configButton.Add_Click({
        param($s, $ev)
        $roleId = $s.Tag
        Show-QuickPolicyConfigDialog -Window $script:MainWindow -RoleId $roleId
    })

    $editorPanel.Children.Add($configButton)
}

function Show-QuickPolicyConfigDialog {
    param(
        [System.Windows.Window]$Window,
        [string]$RoleId
    )

    $choices = @(
        @{ Label = "Enable MFA on activation"; Description = "Require multi-factor authentication when activating the role" }
        @{ Label = "Enable Justification"; Description = "Require users to provide a reason for activation" }
        @{ Label = "Set activation duration"; Description = "Configure maximum hours for active sessions" }
        @{ Label = "Apply a template"; Description = "Use predefined security settings from templates" }
    )

    $choice = Show-ChoiceDialog -Title "Quick Configure Role Policy" `
        -Message "Choose what to configure:" `
        -Choices $choices `
        -Owner $Window

    switch ($choice) {
        0 {
            Show-PIMBuddyProgress -Window $Window -Message "Enabling MFA requirement..."
            try {
                $result = Set-EntraRoleActivationSettings -RoleDefinitionId $RoleId -RequireMfa $true
                if ($result.Success) {
                    Show-PIMBuddyToast -Window $Window -Message "MFA requirement enabled" -Type "Success"
                    # Force refresh to get updated settings from API
                    Load-PolicyForTarget -Window $Window -TargetId $RoleId -TargetType "Role" -ForceRefresh
                }
                else {
                    Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
                }
            }
            finally {
                Show-PIMBuddyProgress -Window $Window -Hide
            }
        }
        1 {
            Show-PIMBuddyProgress -Window $Window -Message "Enabling justification requirement..."
            try {
                $result = Set-EntraRoleActivationSettings -RoleDefinitionId $RoleId -RequireJustification $true
                if ($result.Success) {
                    Show-PIMBuddyToast -Window $Window -Message "Justification requirement enabled" -Type "Success"
                    # Force refresh to get updated settings from API
                    Load-PolicyForTarget -Window $Window -TargetId $RoleId -TargetType "Role" -ForceRefresh
                }
                else {
                    Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
                }
            }
            finally {
                Show-PIMBuddyProgress -Window $Window -Hide
            }
        }
        2 {
            $duration = Show-InputDialog -Title "Set Duration" `
                -Message "Enter maximum activation duration (1-24 hours):" `
                -DefaultValue "8" `
                -IsNumeric `
                -MinValue 1 `
                -MaxValue 24 `
                -Owner $Window

            # Safely validate the duration value
            if ($null -ne $duration -and $duration -is [string] -and $duration -match '^\d+$') {
                Show-PIMBuddyProgress -Window $Window -Message "Setting activation duration to $duration hours..."
                try {
                    $result = Set-EntraRoleActivationSettings -RoleDefinitionId $RoleId -MaximumDurationHours ([int]$duration)
                    if ($result.Success) {
                        Show-PIMBuddyToast -Window $Window -Message "Duration set to $duration hours" -Type "Success"
                        # Force refresh to get updated settings from API
                        Load-PolicyForTarget -Window $Window -TargetId $RoleId -TargetType "Role" -ForceRefresh
                    }
                    else {
                        Show-PIMBuddyToast -Window $Window -Message "Failed: $($result.Error)" -Type "Error"
                    }
                }
                finally {
                    Show-PIMBuddyProgress -Window $Window -Hide
                }
            }
        }
        3 {
            # Navigate to templates
            $navTemplates = $Window.FindName("NavTemplates")
            if ($navTemplates) { $navTemplates.IsChecked = $true }
        }
    }
}

#endregion

#region Templates UI

function Show-TemplatePreviewDialog {
    param(
        [System.Windows.Window]$Window,
        [string]$TemplateId
    )

    $templateInfo = switch ($TemplateId) {
        "secure-admin" {
            @{
                Name = "Secure Admin Access"
                Settings = @(
                    "• Maximum activation: 8 hours"
                    "• MFA required: Yes"
                    "• Justification required: Yes"
                    "• Approval required: No"
                    "• Permanent eligible: No"
                    "• Permanent active: No"
                )
                Recommendation = "Recommended for: Standard admin roles, Security Admins, Exchange Admins"
            }
        }
        "zero-trust" {
            @{
                Name = "Zero Trust Security"
                Settings = @(
                    "• Maximum activation: 4 hours"
                    "• MFA required: Yes"
                    "• Justification required: Yes"
                    "• Approval required: Yes"
                    "• Permanent eligible: No"
                    "• Permanent active: No"
                )
                Recommendation = "Recommended for: Global Administrator, Privileged Role Administrator"
            }
        }
        "contractor" {
            @{
                Name = "Contractor/External Access"
                Settings = @(
                    "• Maximum activation: 2 hours"
                    "• MFA required: Yes"
                    "• Justification required: Yes"
                    "• Approval required: Yes"
                    "• Maximum eligible assignment: 90 days"
                    "• Permanent active: No"
                )
                Recommendation = "Recommended for: External users, contractors, vendors"
            }
        }
        "break-glass" {
            @{
                Name = "Break Glass Accounts"
                Settings = @(
                    "• Maximum activation: 8 hours"
                    "• MFA required: No (emergency access)"
                    "• Justification required: Yes"
                    "• Approval required: No"
                    "• Permanent eligible: Yes"
                    "• Strong monitoring enabled"
                )
                Recommendation = "Recommended for: Emergency access accounts only"
            }
        }
        "devops" {
            @{
                Name = "Developer/DevOps Access"
                Settings = @(
                    "• Maximum activation: 12 hours"
                    "• MFA required: Yes"
                    "• Justification required: Yes"
                    "• Approval required: No"
                    "• Permanent eligible: No"
                    "• Permanent active: No"
                )
                Recommendation = "Recommended for: Application Admin, Cloud App Admin, Developer roles"
            }
        }
        default { $null }
    }

    if (-not $templateInfo) { return $true }

    $settingsText = $templateInfo.Settings -join "`n"
    $message = "Template: $($templateInfo.Name)`n`nSettings to be applied:`n$settingsText`n`n$($templateInfo.Recommendation)`n`nDo you want to apply this template?"

    $confirm = [System.Windows.MessageBox]::Show(
        $message,
        "Template Preview",
        [System.Windows.MessageBoxButton]::YesNo,
        [System.Windows.MessageBoxImage]::Information
    )

    return $confirm -eq [System.Windows.MessageBoxResult]::Yes
}

function Apply-SelectedTemplate {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [string]$TemplateId
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    # Show template preview first
    if (-not (Show-TemplatePreviewDialog -Window $Window -TemplateId $TemplateId)) {
        return
    }

    # Ask for tier selection
    $tierChoices = @(
        @{ Label = "High-Privilege Roles (Recommended)"; Description = "Global Admin, Privileged Role Admin, Security Admin - strictest settings" }
        @{ Label = "Medium-Privilege Roles"; Description = "User Admin, Exchange Admin, SharePoint Admin - balanced settings" }
        @{ Label = "Low-Privilege Roles"; Description = "Helpdesk Admin, Reader roles - more flexible settings" }
        @{ Label = "Select Specific Role"; Description = "Choose a specific role from the list" }
    )

    $tierChoice = Show-ChoiceDialog -Title "Select Target Tier" `
        -Message "Which role tier should this template be applied to?" `
        -Choices $tierChoices `
        -Owner $Window

    if ($null -eq $tierChoice) { return }

    # Get roles based on tier selection
    Show-PIMBuddyProgress -Window $Window -Message "Loading Entra ID roles..."
    $rolesResult = Get-CachedRoles
    Show-PIMBuddyProgress -Window $Window -Hide

    if (-not $rolesResult.Success -or $rolesResult.Roles.Count -eq 0) {
        Show-PIMBuddyToast -Window $Window -Message "No Entra ID roles available." -Type "Warning"
        return
    }

    $highPrivRoles = @("Global Administrator", "Privileged Role Administrator", "Security Administrator", "Privileged Authentication Administrator")
    $mediumPrivRoles = @("User Administrator", "Exchange Administrator", "SharePoint Administrator", "Teams Administrator", "Intune Administrator", "Compliance Administrator")

    $targetRoles = switch ($tierChoice) {
        0 { $rolesResult.Roles | Where-Object { $_.DisplayName -in $highPrivRoles } }
        1 { $rolesResult.Roles | Where-Object { $_.DisplayName -in $mediumPrivRoles } }
        2 { $rolesResult.Roles | Where-Object { $_.DisplayName -notin ($highPrivRoles + $mediumPrivRoles) } }
        3 {
            # Select specific role
            $sortedRoles = $rolesResult.Roles | Sort-Object DisplayName
            $selectedRole = Show-SelectionDialog -Title "Select Role for Template" `
                -Message "Select the Entra ID role to apply the template to:" `
                -Items $sortedRoles `
                -DisplayProperty "DisplayName" `
                -Owner $Window
            if ($selectedRole) { @($selectedRole) } else { @() }
        }
    }

    if (-not $targetRoles -or $targetRoles.Count -eq 0) {
        Show-PIMBuddyToast -Window $Window -Message "No roles found for the selected tier." -Type "Warning"
        return
    }

    # Confirm if multiple roles
    if ($targetRoles.Count -gt 1) {
        $roleNames = ($targetRoles | Select-Object -First 5 | ForEach-Object { $_.DisplayName }) -join ", "
        if ($targetRoles.Count -gt 5) { $roleNames += "..." }

        $confirm = [System.Windows.MessageBox]::Show(
            "Apply template to $($targetRoles.Count) roles?`n`nRoles: $roleNames",
            "Confirm Bulk Apply",
            [System.Windows.MessageBoxButton]::YesNo,
            [System.Windows.MessageBoxImage]::Question
        )
        if ($confirm -ne [System.Windows.MessageBoxResult]::Yes) { return }
    }

    # Apply template to all target roles
    $successCount = 0
    $failCount = 0
    $totalRoles = $targetRoles.Count

    Show-PIMBuddyProgress -Window $Window -Message "Applying template to $totalRoles role(s)..."

    try {
        foreach ($role in $targetRoles) {
            try {
                $result = Apply-PIMTemplateToRole -TemplateId $TemplateId -RoleDefinitionId $role.Id
                if ($result.Success) {
                    $successCount++
                    Write-PIMBuddyLog -Message "Template applied to: $($role.DisplayName)" -Level "Info"
                }
                else {
                    $failCount++
                    Write-PIMBuddyLog -Message "Failed to apply template to: $($role.DisplayName) - $($result.Error)" -Level "Warning"
                }
            }
            catch {
                $failCount++
                Write-PIMBuddyLog -Message "Error applying template to: $($role.DisplayName)" -Level "Error" -Exception $_.Exception
            }
        }

        if ($failCount -eq 0) {
            Show-PIMBuddyToast -Window $Window -Message "Template applied to $successCount role(s) successfully" -Type "Success"
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Applied to $successCount roles, $failCount failed" -Type "Warning"
        }

        # Refresh policy view if on that page
        Refresh-PolicyTargets -Window $Window -ForceRefresh
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

#endregion

#region Advanced Features UI

function Show-BulkOperationProgress {
    <#
    .SYNOPSIS
        Show a progress dialog for bulk operations
    .PARAMETER Window
        Parent window
    .PARAMETER Title
        Dialog title
    .PARAMETER Items
        Items to process
    .PARAMETER ScriptBlock
        Code to execute for each item
    #>
    param(
        [System.Windows.Window]$Window,
        [string]$Title = "Bulk Operation",
        [array]$Items,
        [scriptblock]$ScriptBlock
    )

    $xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="$Title" Width="450" Height="200"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        WindowStyle="SingleBorderWindow" Background="#FAFAFA">
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <TextBlock x:Name="StatusText" Grid.Row="0" Text="Processing..." FontSize="14" Margin="0,0,0,10"/>
        <ProgressBar x:Name="ProgressBar" Grid.Row="1" Height="25" Minimum="0" Maximum="100" Value="0"/>
        <TextBlock x:Name="ProgressText" Grid.Row="2" Text="0 / 0" HorizontalAlignment="Center" Margin="0,5,0,0" Foreground="#605E5C"/>
        <TextBox x:Name="LogBox" Grid.Row="3" IsReadOnly="True" VerticalScrollBarVisibility="Auto"
                 FontFamily="Consolas" FontSize="11" Margin="0,10,0,10" Background="#F3F2F1"/>
        <Button x:Name="CloseButton" Grid.Row="4" Content="Close" Width="100" Height="30"
                HorizontalAlignment="Right" IsEnabled="False" Background="#0078D4" Foreground="White"/>
    </Grid>
</Window>
"@

    try {
        # Ensure Items is an array
        $itemsArray = @($Items)
        if ($null -eq $itemsArray -or $itemsArray.Count -eq 0) {
            return @{ Success = 0; Failed = 0; Errors = @("No items to process") }
        }

        $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
        $dialog = [System.Windows.Markup.XamlReader]::Load($reader)

        if ($Window) { $dialog.Owner = $Window }

        $statusText = $dialog.FindName("StatusText")
        $progressBar = $dialog.FindName("ProgressBar")
        $progressText = $dialog.FindName("ProgressText")
        $logBox = $dialog.FindName("LogBox")
        $closeButton = $dialog.FindName("CloseButton")

        $closeButton.Add_Click({ $dialog.Close() })

        $total = $itemsArray.Count
        $progressBar.Maximum = $total

        # Store items and script in script scope for access in event handler
        $script:BulkItems = $itemsArray
        $script:BulkScript = $ScriptBlock
        $script:BulkResults = @{ Success = 0; Failed = 0; Errors = @() }

        # Process items after dialog is shown
        $dialog.Add_ContentRendered({
            $current = 0
            foreach ($item in $script:BulkItems) {
                $current++
                $itemName = if ($item.DisplayName) { $item.DisplayName } else { $item.ToString() }
                $statusText.Text = "Processing: $itemName"
                $progressBar.Value = $current
                $progressText.Text = "$current / $total"

                try {
                    $result = & $script:BulkScript $item
                    if ($result.Success) {
                        $script:BulkResults.Success++
                        $logBox.AppendText("[OK] $itemName`n")
                    } else {
                        $script:BulkResults.Failed++
                        $script:BulkResults.Errors += "$itemName`: $($result.Error)"
                        $logBox.AppendText("[FAIL] $itemName - $($result.Error)`n")
                    }
                }
                catch {
                    $script:BulkResults.Failed++
                    $script:BulkResults.Errors += "$itemName`: $($_.Exception.Message)"
                    $logBox.AppendText("[ERROR] $itemName - $($_.Exception.Message)`n")
                }

                # Allow UI to update
                [System.Windows.Forms.Application]::DoEvents()
            }

            $statusText.Text = "Complete: $($script:BulkResults.Success) succeeded, $($script:BulkResults.Failed) failed"
            $closeButton.IsEnabled = $true
        })

        $null = $dialog.ShowDialog()
        $returnResults = $script:BulkResults

        # Clean up script scope variables
        $script:BulkItems = $null
        $script:BulkScript = $null
        $script:BulkResults = $null

        return $returnResults
    }
    catch {
        Write-PIMBuddyLog -Message "Bulk operation dialog error: $($_.Exception.Message)" -Level "Error"
        $itemCount = if ($Items) { @($Items).Count } else { 0 }
        return @{ Success = 0; Failed = $itemCount; Errors = @($_.Exception.Message) }
    }
}

function Show-PolicyComparisonDialog {
    <#
    .SYNOPSIS
        Show dialog to compare two PIM policies
    #>
    param(
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    # Get roles for selection
    Show-PIMBuddyProgress -Window $Window -Message "Loading roles..."
    $rolesResult = Get-CachedRoles
    Show-PIMBuddyProgress -Window $Window -Hide

    $roles = @($rolesResult.Roles)
    if (-not $rolesResult.Success -or $roles.Count -lt 2) {
        Show-PIMBuddyToast -Window $Window -Message "Need at least 2 roles to compare" -Type "Warning"
        return
    }

    $sortedRoles = $roles | Sort-Object DisplayName

    # Select first role
    $role1 = Show-SelectionDialog -Title "Select First Role" `
        -Message "Select the first role to compare:" `
        -Items $sortedRoles `
        -DisplayProperty "DisplayName" `
        -Owner $Window

    if (-not $role1) { return }

    # Select second role
    $role2 = Show-SelectionDialog -Title "Select Second Role" `
        -Message "Select the second role to compare with '$($role1.DisplayName)':" `
        -Items ($sortedRoles | Where-Object { $_.Id -ne $role1.Id }) `
        -DisplayProperty "DisplayName" `
        -Owner $Window

    if (-not $role2) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Comparing policies..."

    try {
        # Get both policies
        $policy1 = Get-EntraRolePolicy -RoleDefinitionId $role1.Id
        $policy2 = Get-EntraRolePolicy -RoleDefinitionId $role2.Id

        if (-not $policy1.Success -or -not $policy2.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load one or both policies" -Type "Error"
            return
        }

        # Compare using AdvancedFeatures function
        $comparison = Compare-PIMPolicies -Policy1 $policy1.Settings -Policy2 $policy2.Settings `
            -Policy1Name $role1.DisplayName -Policy2Name $role2.DisplayName

        # Build result message
        $message = "Policy Comparison Results`n"
        $message += "========================`n`n"
        $message += "Comparing: $($role1.DisplayName) vs $($role2.DisplayName)`n`n"

        if ($comparison.HasDifferences) {
            $message += "Found $($comparison.DifferenceCount) differences:`n`n"

            foreach ($diff in $comparison.Differences) {
                $message += "[$($diff.Category)] $($diff.Setting)`n"
                $message += "  $($role1.DisplayName): $($diff.$($role1.DisplayName))`n"
                $message += "  $($role2.DisplayName): $($diff.$($role2.DisplayName))`n`n"
            }
        } else {
            $message += "No differences found. Both policies have identical settings."
        }

        [System.Windows.MessageBox]::Show(
            $message,
            "Policy Comparison",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Information
        )
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error comparing policies: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Show-ComplianceReportDialog {
    <#
    .SYNOPSIS
        Show compliance report for all PIM groups
    #>
    param(
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    Show-PIMBuddyProgress -Window $Window -Message "Generating compliance report..."

    try {
        $reportResult = Get-TenantComplianceReport

        if (-not $reportResult.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Failed to generate report: $($reportResult.Error)" -Type "Error"
            return
        }

        $report = $reportResult.Report
        $summary = $report.Summary

        # Build report message
        $message = "Tenant Compliance Report`n"
        $message += "========================`n`n"
        $message += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n`n"
        $message += "SUMMARY`n"
        $message += "-------`n"
        $message += "Total Groups: $($summary.TotalGroups)`n"
        $message += "Compliant: $($summary.CompliantCount)`n"
        $message += "Partially Compliant: $($summary.PartiallyCompliantCount)`n"
        $message += "Non-Compliant: $($summary.NonCompliantCount)`n"
        $message += "Average Score: $($summary.AverageScore)/100`n"
        $message += "Critical Findings: $($summary.CriticalFindingsTotal)`n`n"

        $reportGroups = @($report.Groups)
        if ($reportGroups.Count -gt 0) {
            $message += "GROUP DETAILS`n"
            $message += "-------------`n"

            foreach ($group in $reportGroups | Sort-Object Score) {
                $message += "`n$($group.GroupName)`n"
                $message += "  Score: $($group.Score) - $($group.Status)`n"
                if ($group.CriticalCount -gt 0) {
                    $message += "  Critical Issues: $($group.CriticalCount)`n"
                }
            }
        }

        [System.Windows.MessageBox]::Show(
            $message,
            "Compliance Report",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Information
        )
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error generating report: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Show-AuditLogDialog {
    <#
    .SYNOPSIS
        Show audit log viewer dialog
    #>
    param(
        [System.Windows.Window]$Window
    )

    $entries = @(Get-AuditLog -Last 50)

    if ($null -eq $entries -or $entries.Count -eq 0) {
        [System.Windows.MessageBox]::Show(
            "No audit log entries found.`n`nAudit entries are created when you make changes to policies, groups, or templates.",
            "Audit Log",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Information
        )
        return
    }

    $entryCount = $entries.Count
    $message = "PIMBuddy Audit Log`n"
    $message += "==================`n`n"
    $message += "Last $entryCount entries:`n`n"

    foreach ($entry in $entries) {
        $timestamp = if ($entry.Timestamp) { ([datetime]$entry.Timestamp).ToString("MM/dd HH:mm") } else { "N/A" }
        $message += "[$timestamp] $($entry.Action) - $($entry.TargetType)"
        if ($entry.TargetName) { $message += " '$($entry.TargetName)'" }
        $message += "`n"
        if ($entry.Details) { $message += "  Details: $($entry.Details)`n" }
    }

    [System.Windows.MessageBox]::Show(
        $message,
        "Audit Log",
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Information
    )
}

function Show-CopyPolicyDialog {
    <#
    .SYNOPSIS
        Show dialog to copy policy from one group to another
    #>
    param(
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    # Get PIM groups
    Show-PIMBuddyProgress -Window $Window -Message "Loading PIM groups..."
    $groupsResult = Get-CachedGroups
    Show-PIMBuddyProgress -Window $Window -Hide

    $groups = @($groupsResult.Groups)
    if (-not $groupsResult.Success -or $groups.Count -lt 2) {
        Show-PIMBuddyToast -Window $Window -Message "Need at least 2 PIM groups to copy policy" -Type "Warning"
        return
    }

    $sortedGroups = $groups | Sort-Object DisplayName

    # Select source group
    $sourceGroup = Show-SelectionDialog -Title "Select Source Group" `
        -Message "Select the group to copy policy FROM:" `
        -Items $sortedGroups `
        -DisplayProperty "DisplayName" `
        -Owner $Window

    if (-not $sourceGroup) { return }

    # Select target group
    $targetGroup = Show-SelectionDialog -Title "Select Target Group" `
        -Message "Select the group to copy policy TO:`n(Current policy will be backed up for rollback)" `
        -Items ($sortedGroups | Where-Object { $_.Id -ne $sourceGroup.Id }) `
        -DisplayProperty "DisplayName" `
        -Owner $Window

    if (-not $targetGroup) { return }

    # Confirm
    $confirm = [System.Windows.MessageBox]::Show(
        "Copy policy settings from '$($sourceGroup.DisplayName)' to '$($targetGroup.DisplayName)'?`n`nThis will overwrite the target group's current policy settings.`nA backup will be saved for potential rollback.",
        "Confirm Policy Copy",
        [System.Windows.MessageBoxButton]::YesNo,
        [System.Windows.MessageBoxImage]::Question
    )

    if ($confirm -ne [System.Windows.MessageBoxResult]::Yes) { return }

    Show-PIMBuddyProgress -Window $Window -Message "Copying policy..."

    try {
        $result = Copy-PIMPolicy -SourceGroupId $sourceGroup.Id -TargetGroupId $targetGroup.Id -IncludeActivation -IncludeAssignment

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Policy copied successfully!" -Type "Success"
        } else {
            Show-PIMBuddyToast -Window $Window -Message "Policy copy failed: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Show-GlobalSearchDialog {
    <#
    .SYNOPSIS
        Show global search dialog to search across groups, roles, and policies
    #>
    param(
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    $searchText = Show-InputDialog -Title "Global Search" `
        -Message "Enter search term to find across groups, roles, and templates:" `
        -DefaultValue "" `
        -Owner $Window

    if ($null -eq $searchText -or $searchText -isnot [string] -or [string]::IsNullOrWhiteSpace($searchText)) {
        return
    }

    $searchLower = $searchText.ToLower()

    Show-PIMBuddyProgress -Window $Window -Message "Searching..."

    try {
        # PERFORMANCE: Use List<T> instead of array += for better performance
        $results = [System.Collections.Generic.List[PSCustomObject]]::new()

        # Search groups
        $groupsResult = Get-CachedGroups
        if ($groupsResult.Success) {
            $groupsResult.Groups | Where-Object {
                $_.DisplayName.ToLower().Contains($searchLower) -or
                ($_.Description -and $_.Description.ToLower().Contains($searchLower))
            } | ForEach-Object {
                $results.Add([PSCustomObject]@{
                    Type = "Group"
                    Name = $_.DisplayName
                    Description = $_.Description
                    Id = $_.Id
                })
            }
        }

        # Search roles
        $rolesResult = Get-CachedRoles
        if ($rolesResult.Success) {
            $rolesResult.Roles | Where-Object {
                $_.DisplayName.ToLower().Contains($searchLower) -or
                ($_.Description -and $_.Description.ToLower().Contains($searchLower))
            } | ForEach-Object {
                $results.Add([PSCustomObject]@{
                    Type = "Role"
                    Name = $_.DisplayName
                    Description = $_.Description
                    Id = $_.Id
                })
            }
        }

        # Search templates
        if ($script:AvailableTemplates) {
            $script:AvailableTemplates | Where-Object {
                $_.Name.ToLower().Contains($searchLower) -or
                ($_.Description -and $_.Description.ToLower().Contains($searchLower))
            } | ForEach-Object {
                $results.Add([PSCustomObject]@{
                    Type = "Template"
                    Name = $_.Name
                    Description = $_.Description
                    Id = $_.Id
                })
            }
        }

        Show-PIMBuddyProgress -Window $Window -Hide

        if ($results.Count -eq 0) {
            Show-PIMBuddyToast -Window $Window -Message "No results found for '$searchText'" -Type "Info"
            return
        }

        # Show results
        $message = "Search Results for '$searchText'`n"
        $message += "================================`n`n"
        $message += "Found $($results.Count) matches:`n`n"

        $groupedResults = $results | Group-Object Type
        foreach ($group in $groupedResults) {
            $message += "[$($group.Name)s]`n"
            foreach ($item in $group.Group) {
                $message += "  - $($item.Name)`n"
            }
            $message += "`n"
        }

        [System.Windows.MessageBox]::Show(
            $message,
            "Search Results",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Information
        )
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Search error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Initialize-KeyboardShortcuts {
    <#
    .SYNOPSIS
        Set up keyboard shortcuts for the main window
    #>
    param(
        [System.Windows.Window]$Window
    )

    $Window.Add_KeyDown({
        param($sender, $e)

        # Check for Ctrl key modifier
        $ctrlPressed = [System.Windows.Input.Keyboard]::Modifiers -band [System.Windows.Input.ModifierKeys]::Control

        if ($ctrlPressed) {
            switch ($e.Key) {
                # Ctrl+G - Navigate to Groups
                ([System.Windows.Input.Key]::G) {
                    $navGroups = $script:MainWindow.FindName("NavGroups")
                    if ($navGroups) { $navGroups.IsChecked = $true }
                    $e.Handled = $true
                }
                # Ctrl+R - Navigate to Roles
                ([System.Windows.Input.Key]::R) {
                    $navRoles = $script:MainWindow.FindName("NavRoles")
                    if ($navRoles) { $navRoles.IsChecked = $true }
                    $e.Handled = $true
                }
                # Ctrl+P - Navigate to Policies
                ([System.Windows.Input.Key]::P) {
                    $navPolicies = $script:MainWindow.FindName("NavPolicies")
                    if ($navPolicies) { $navPolicies.IsChecked = $true }
                    $e.Handled = $true
                }
                # Ctrl+T - Navigate to Templates
                ([System.Windows.Input.Key]::T) {
                    $navTemplates = $script:MainWindow.FindName("NavTemplates")
                    if ($navTemplates) { $navTemplates.IsChecked = $true }
                    $e.Handled = $true
                }
                # Ctrl+D - Navigate to Dashboard
                ([System.Windows.Input.Key]::D) {
                    $navDashboard = $script:MainWindow.FindName("NavDashboard")
                    if ($navDashboard) { $navDashboard.IsChecked = $true }
                    $e.Handled = $true
                }
                # Ctrl+N - New Group
                ([System.Windows.Input.Key]::N) {
                    if ($script:IsConnected) {
                        Show-CreateGroupDialog -Window $script:MainWindow
                    }
                    $e.Handled = $true
                }
                # Ctrl+F - Global Search
                ([System.Windows.Input.Key]::F) {
                    if ($script:IsConnected) {
                        Show-GlobalSearchDialog -Window $script:MainWindow
                    }
                    $e.Handled = $true
                }
                # Ctrl+W - Setup Wizard
                ([System.Windows.Input.Key]::W) {
                    if ($script:IsConnected) {
                        Show-SetupWizard -Window $script:MainWindow
                    }
                    $e.Handled = $true
                }
                # Ctrl+Shift+C - Compare Policies
                ([System.Windows.Input.Key]::C) {
                    $shiftPressed = [System.Windows.Input.Keyboard]::Modifiers -band [System.Windows.Input.ModifierKeys]::Shift
                    if ($shiftPressed -and $script:IsConnected) {
                        Show-PolicyComparisonDialog -Window $script:MainWindow
                    }
                    $e.Handled = $true
                }
            }
        }

        # F1 - Show keyboard shortcuts help
        if ($e.Key -eq [System.Windows.Input.Key]::F1) {
            Show-KeyboardShortcutsHelp -Window $script:MainWindow
            $e.Handled = $true
        }

        # F5 - Refresh current view
        if ($e.Key -eq [System.Windows.Input.Key]::F5) {
            if ($script:IsConnected) {
                # Determine current page and refresh
                $navGroups = $script:MainWindow.FindName("NavGroups")
                $navRoles = $script:MainWindow.FindName("NavRoles")
                $navPolicies = $script:MainWindow.FindName("NavPolicies")
                $navDashboard = $script:MainWindow.FindName("NavDashboard")

                if ($navGroups -and $navGroups.IsChecked) {
                    Refresh-GroupsList -Window $script:MainWindow -ForceRefresh
                } elseif ($navRoles -and $navRoles.IsChecked) {
                    Refresh-RolesList -Window $script:MainWindow -ForceRefresh
                } elseif ($navPolicies -and $navPolicies.IsChecked) {
                    Refresh-PolicyTargets -Window $script:MainWindow -ForceRefresh
                } elseif ($navDashboard -and $navDashboard.IsChecked) {
                    Refresh-DashboardData -Window $script:MainWindow
                }
            }
            $e.Handled = $true
        }
    })

    Write-PIMBuddyLog -Message "Keyboard shortcuts initialized" -Level "Debug"
}

function Show-KeyboardShortcutsHelp {
    param([System.Windows.Window]$Window)

    $help = @"
Keyboard Shortcuts
==================

Navigation:
  Ctrl+D    - Dashboard
  Ctrl+G    - Groups
  Ctrl+R    - Roles
  Ctrl+P    - Policies
  Ctrl+T    - Templates

Actions:
  Ctrl+N    - Create New Group
  Ctrl+F    - Global Search
  Ctrl+W    - Setup Wizard
  Ctrl+Shift+C - Compare Policies

General:
  F1        - Show this help
  F5        - Refresh current view
  Escape    - Close dialogs
"@

    [System.Windows.MessageBox]::Show(
        $help,
        "Keyboard Shortcuts",
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Information
    )
}

function Show-AdvancedActionsMenu {
    <#
    .SYNOPSIS
        Show menu of advanced features
    #>
    param(
        [System.Windows.Window]$Window
    )

    $choices = @(
        @{ Label = "Compare Policies"; Description = "Compare settings between two roles" }
        @{ Label = "Copy Policy"; Description = "Copy policy from one group to another" }
        @{ Label = "Compliance Report"; Description = "View compliance status across all groups" }
        @{ Label = "View Audit Log"; Description = "See recent changes made through PIMBuddy" }
    )

    $choice = Show-ChoiceDialog -Title "Advanced Actions" `
        -Message "Select an advanced action:" `
        -Choices $choices `
        -Owner $Window

    switch ($choice) {
        0 { Show-PolicyComparisonDialog -Window $Window }
        1 { Show-CopyPolicyDialog -Window $Window }
        2 { Show-ComplianceReportDialog -Window $Window }
        3 { Show-AuditLogDialog -Window $Window }
    }
}

#endregion

#region Setup Wizard

# Script variables to track wizard state
$script:WizardState = @{
    Step = 0
    GroupId = $null
    GroupName = $null
    RoleId = $null
    RoleName = $null
    TemplateId = $null
    TemplateName = $null
}

function Show-SetupWizard {
    <#
    .SYNOPSIS
        Launch the guided PIM setup wizard
    .DESCRIPTION
        Walks users through:
        1. Creating a PIM-enabled group
        2. Assigning the group to an Entra ID role
        3. Configuring the policy using templates
    #>
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect to Microsoft Graph first" -Type "Warning"
        return
    }

    # Reset wizard state
    $script:WizardState = @{
        Step = 0
        GroupId = $null
        GroupName = $null
        RoleId = $null
        RoleName = $null
        TemplateId = $null
        TemplateName = $null
    }

    # Show welcome dialog
    $welcomeChoices = @(
        @{ Label = "Start Fresh - Create New Group"; Description = "Create a new role-assignable security group from scratch" }
        @{ Label = "Use Existing Group"; Description = "Select an existing PIM group and continue with role assignment" }
        @{ Label = "Learn More"; Description = "Understand how PIM groups work before starting" }
    )

    $choice = Show-ChoiceDialog -Title "PIM Setup Wizard" `
        -Message "Welcome to the PIM Setup Wizard!`n`nThis wizard will guide you through setting up Privileged Identity Management with best practices:`n`n1. Create a PIM-enabled group`n2. Assign the group to an Entra ID role`n3. Configure security policies`n`nHow would you like to proceed?" `
        -Choices $welcomeChoices `
        -Owner $Window

    switch ($choice) {
        0 { Wizard-Step1-CreateGroup -Window $Window }
        1 { Wizard-Step1-SelectExistingGroup -Window $Window }
        2 { Wizard-ShowHelp -Window $Window }
        default { return }
    }
}

function Wizard-Step1-CreateGroup {
    param([System.Windows.Window]$Window)

    $script:WizardState.Step = 1

    # Get group name
    $dialogResult = Show-InputDialog -Title "Step 1: Create PIM Group" `
        -Message "Enter a name for your new PIM group:`n`nRecommendation: Use a naming convention like 'PIM-RoleName-Access'" `
        -DefaultValue "PIM-" `
        -Owner $Window

    # Validate we got a valid string back
    if ($null -eq $dialogResult -or $dialogResult -isnot [string] -or [string]::IsNullOrWhiteSpace($dialogResult)) {
        Show-PIMBuddyToast -Window $Window -Message "Wizard cancelled" -Type "Info"
        return
    }

    $groupName = [string]$dialogResult.Trim()

    # Generate mail nickname - ensure it's not empty
    $mailNickname = $groupName -replace '[^a-zA-Z0-9_-]', '' -replace '\s+', '-'
    if ([string]::IsNullOrWhiteSpace($mailNickname)) {
        $mailNickname = "PIMGroup-" + (Get-Random -Maximum 9999)
    }
    if ($mailNickname.Length -gt 64) {
        $mailNickname = $mailNickname.Substring(0, 64)
    }

    Write-PIMBuddyLog -Message "Wizard creating group: Name='$groupName', MailNickname='$mailNickname'" -Level "Info"

    Show-PIMBuddyProgress -Window $Window -Message "Creating group: $groupName..."

    try {
        $result = New-PIMGroup -DisplayName $groupName -MailNickname $mailNickname -Description "Created via PIMBuddy Setup Wizard" -Confirm:$false

        # Safe property access for logging
        $resultSuccess = $result.Success
        $resultError = if ($result -is [hashtable] -and $result.ContainsKey('Error')) { $result.Error } else { "N/A" }
        $resultGroupId = if ($result -is [hashtable] -and $result.ContainsKey('GroupId')) { $result.GroupId } else { "N/A" }
        Write-PIMBuddyLog -Message "Wizard New-PIMGroup result: Success=$resultSuccess, Error=$resultError, GroupId=$resultGroupId" -Level "Debug"

        if ($result.Success) {
            $script:WizardState.GroupId = $result.GroupId
            $script:WizardState.GroupName = $groupName

            Show-PIMBuddyToast -Window $Window -Message "Group '$groupName' created successfully!" -Type "Success"

            # Clear groups cache so fresh data is loaded
            $script:CachedGroups = $null
            $script:GroupsCacheTime = $null

            # Refresh groups list
            Refresh-GroupsList -Window $Window

            # Continue to step 2
            Wizard-Step2-SelectRole -Window $Window
        }
        else {
            $errorMsg = if ($result -is [hashtable] -and $result.ContainsKey('Error') -and $result.Error) { $result.Error } else { "Unknown error - check logs for details" }
            Write-PIMBuddyLog -Message "Wizard group creation failed: $errorMsg" -Level "Error"
            Show-PIMBuddyToast -Window $Window -Message "Failed to create group: $errorMsg" -Type "Error" -DurationMs 5000

            # Show a message box for better visibility
            [System.Windows.MessageBox]::Show(
                "Failed to create group '$groupName':`n`n$errorMsg",
                "Group Creation Failed",
                [System.Windows.MessageBoxButton]::OK,
                [System.Windows.MessageBoxImage]::Error
            )
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-PIMBuddyLog -Message "Wizard exception during group creation: $errorMsg" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Error: $errorMsg" -Type "Error" -DurationMs 5000

        [System.Windows.MessageBox]::Show(
            "Error creating group '$groupName':`n`n$errorMsg",
            "Group Creation Error",
            [System.Windows.MessageBoxButton]::OK,
            [System.Windows.MessageBoxImage]::Error
        )
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Wizard-Step1-SelectExistingGroup {
    param([System.Windows.Window]$Window)

    $script:WizardState.Step = 1

    Show-PIMBuddyProgress -Window $Window -Message "Loading PIM groups..."

    try {
        $groupsResult = Get-PIMGroups
        Show-PIMBuddyProgress -Window $Window -Hide

        if (-not $groupsResult.Success -or $groupsResult.Groups.Count -eq 0) {
            $createNew = [System.Windows.MessageBox]::Show(
                "No existing PIM groups found. Would you like to create one?",
                "No Groups Found",
                [System.Windows.MessageBoxButton]::YesNo,
                [System.Windows.MessageBoxImage]::Question
            )
            if ($createNew -eq [System.Windows.MessageBoxResult]::Yes) {
                Wizard-Step1-CreateGroup -Window $Window
            }
            return
        }

        # Show selection dialog
        $sortedGroups = $groupsResult.Groups | Sort-Object DisplayName
        $selectedGroup = Show-SelectionDialog -Title "Step 1: Select Existing Group" `
            -Message "Select a PIM group to configure:" `
            -Items $sortedGroups `
            -DisplayProperty "DisplayName" `
            -Owner $Window

        if ($selectedGroup) {
            $script:WizardState.GroupId = $selectedGroup.Id
            $script:WizardState.GroupName = $selectedGroup.DisplayName

            Show-PIMBuddyToast -Window $Window -Message "Selected: $($selectedGroup.DisplayName)" -Type "Info"

            # Continue to step 2
            Wizard-Step2-SelectRole -Window $Window
        }
    }
    catch {
        Show-PIMBuddyProgress -Window $Window -Hide
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
}

function Wizard-Step2-SelectRole {
    param([System.Windows.Window]$Window)

    $script:WizardState.Step = 2
    $groupName = $script:WizardState.GroupName

    Show-PIMBuddyProgress -Window $Window -Message "Loading Entra ID roles..."

    try {
        $rolesResult = Get-CachedRoles
        Show-PIMBuddyProgress -Window $Window -Hide

        if (-not $rolesResult.Success -or $rolesResult.Roles.Count -eq 0) {
            Show-PIMBuddyToast -Window $Window -Message "Failed to load roles" -Type "Error"
            return
        }

        # Categorize roles for easier selection
        $roleCategories = @(
            @{ Label = "High-Privilege Roles"; Description = "Global Admin, Security Admin, etc. - Most sensitive" }
            @{ Label = "Administrative Roles"; Description = "User Admin, Exchange Admin, etc. - Moderate privilege" }
            @{ Label = "Reader/Viewer Roles"; Description = "Security Reader, Reports Reader, etc. - Limited scope" }
            @{ Label = "Browse All Roles"; Description = "Select from the complete list of Entra ID roles" }
        )

        $categoryChoice = Show-ChoiceDialog -Title "Step 2: Select Role for '$groupName'" `
            -Message "Which type of role do you want to assign this group to?" `
            -Choices $roleCategories `
            -Owner $Window

        if ($null -eq $categoryChoice) {
            Show-PIMBuddyToast -Window $Window -Message "Wizard cancelled at step 2" -Type "Info"
            return
        }

        $highPrivRoles = @("Global Administrator", "Privileged Role Administrator", "Security Administrator", "Privileged Authentication Administrator")
        $adminRoles = @("User Administrator", "Exchange Administrator", "SharePoint Administrator", "Teams Administrator", "Intune Administrator", "Application Administrator", "Cloud Application Administrator")
        $readerRoles = @("Security Reader", "Global Reader", "Reports Reader", "Directory Readers", "Message Center Reader")

        $filteredRoles = switch ($categoryChoice) {
            0 { $rolesResult.Roles | Where-Object { $_.DisplayName -in $highPrivRoles } }
            1 { $rolesResult.Roles | Where-Object { $_.DisplayName -in $adminRoles } }
            2 { $rolesResult.Roles | Where-Object { $_.DisplayName -in $readerRoles } }
            default { $rolesResult.Roles }
        }

        if (-not $filteredRoles -or @($filteredRoles).Count -eq 0) {
            $filteredRoles = $rolesResult.Roles
        }

        $sortedRoles = $filteredRoles | Sort-Object DisplayName
        $selectedRole = Show-SelectionDialog -Title "Select Entra ID Role" `
            -Message "Select the role to assign '$groupName' to:" `
            -Items $sortedRoles `
            -DisplayProperty "DisplayName" `
            -Owner $Window

        if ($selectedRole) {
            $script:WizardState.RoleId = $selectedRole.Id
            $script:WizardState.RoleName = $selectedRole.DisplayName

            # Ask about assignment type
            $assignmentChoices = @(
                @{ Label = "Eligible Assignment (Recommended)"; Description = "Users must activate the role when needed - follows JIT principle" }
                @{ Label = "Active Assignment"; Description = "Users have the role immediately - use sparingly" }
            )

            $assignmentChoice = Show-ChoiceDialog -Title "Assignment Type" `
                -Message "How should the group be assigned to '$($selectedRole.DisplayName)'?" `
                -Choices $assignmentChoices `
                -Owner $Window

            if ($null -eq $assignmentChoice) { return }

            $assignmentType = if ($assignmentChoice -eq 0) { "eligible" } else { "active" }

            Show-PIMBuddyProgress -Window $Window -Message "Assigning group to role..."

            try {
                $assignResult = Add-GroupToEntraRole -GroupId $script:WizardState.GroupId `
                    -RoleDefinitionId $selectedRole.Id `
                    -AssignmentType $assignmentType `
                    -Justification "Assigned via PIMBuddy Setup Wizard"

                if ($assignResult.Success) {
                    Show-PIMBuddyToast -Window $Window -Message "Group assigned to '$($selectedRole.DisplayName)' successfully!" -Type "Success"

                    # Continue to step 3
                    Wizard-Step3-ConfigurePolicy -Window $Window
                }
                else {
                    Show-PIMBuddyToast -Window $Window -Message "Failed to assign: $($assignResult.Error)" -Type "Error" -DurationMs 5000
                }
            }
            finally {
                Show-PIMBuddyProgress -Window $Window -Hide
            }
        }
    }
    catch {
        Show-PIMBuddyProgress -Window $Window -Hide
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
}

function Wizard-Step3-ConfigurePolicy {
    param([System.Windows.Window]$Window)

    $script:WizardState.Step = 3
    $roleName = $script:WizardState.RoleName

    # Ask if they want to configure policy
    $policyChoices = @(
        @{ Label = "Apply Security Template (Recommended)"; Description = "Use Microsoft-recommended security settings based on role type" }
        @{ Label = "Configure Manually"; Description = "Set individual policy options like MFA, duration, approval" }
        @{ Label = "Use Default Settings"; Description = "Keep the current/default policy settings" }
        @{ Label = "Create Custom Template"; Description = "Save your own settings as a reusable template" }
    )

    $policyChoice = Show-ChoiceDialog -Title "Step 3: Configure Role Policy for '$roleName'" `
        -Message "How would you like to configure the PIM policy for this role?" `
        -Choices $policyChoices `
        -Owner $Window

    switch ($policyChoice) {
        0 { Wizard-ApplyTemplate -Window $Window }
        1 { Wizard-ManualPolicyConfig -Window $Window }
        2 { Wizard-Complete -Window $Window -Message "Setup complete! Default policy settings will be used." }
        3 { Wizard-CreateCustomTemplate -Window $Window }
        default { Wizard-Complete -Window $Window -Message "Setup complete! You can configure the policy later from the Policies page." }
    }
}

function Wizard-ApplyTemplate {
    param([System.Windows.Window]$Window)

    $roleId = $script:WizardState.RoleId
    $roleName = $script:WizardState.RoleName

    # Determine recommended template based on role
    $highPrivRoles = @("Global Administrator", "Privileged Role Administrator", "Security Administrator")
    $mediumPrivRoles = @("User Administrator", "Exchange Administrator", "SharePoint Administrator")

    $recommendedTier = if ($roleName -in $highPrivRoles) {
        "High-Privilege"
    } elseif ($roleName -in $mediumPrivRoles) {
        "Medium-Privilege"
    } else {
        "Low-Privilege"
    }

    $templateChoices = @(
        @{ Label = "Secure Admin Access - $recommendedTier (Recommended)"; Description = "Microsoft best practices for this role type" }
        @{ Label = "Zero Trust Security"; Description = "Maximum security - short durations, approval required" }
        @{ Label = "Developer/DevOps Access"; Description = "Flexible settings for development workflows" }
        @{ Label = "Custom Templates"; Description = "View your saved custom templates" }
    )

    $templateChoice = Show-ChoiceDialog -Title "Select Security Template" `
        -Message "Choose a template to apply to '$roleName':" `
        -Choices $templateChoices `
        -Owner $Window

    if ($null -eq $templateChoice) {
        Wizard-Complete -Window $Window -Message "Setup complete without policy changes."
        return
    }

    $templateId = switch ($templateChoice) {
        0 { "secure-admin" }
        1 { "zero-trust" }
        2 { "devops" }
        3 {
            # Show custom templates
            $customResult = Get-CustomTemplates
            if ($customResult.Success -and $customResult.Templates.Count -gt 0) {
                $selectedTemplate = Show-SelectionDialog -Title "Select Custom Template" `
                    -Message "Choose a custom template:" `
                    -Items $customResult.Templates `
                    -DisplayProperty "Name" `
                    -Owner $Window
                if ($selectedTemplate) { $selectedTemplate.Id } else { $null }
            }
            else {
                Show-PIMBuddyToast -Window $Window -Message "No custom templates found. Create one first." -Type "Info"
                $null
            }
        }
    }

    if (-not $templateId) {
        Wizard-Complete -Window $Window -Message "Setup complete without policy changes."
        return
    }

    $tierName = $recommendedTier

    Show-PIMBuddyProgress -Window $Window -Message "Applying template..."

    try {
        $result = Apply-PIMTemplateToRole -TemplateId $templateId -RoleDefinitionId $roleId -TierName $tierName

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Template applied successfully!" -Type "Success"
            Wizard-Complete -Window $Window -Message "PIM setup complete! The '$roleName' role is now configured with security best practices."
        }
        else {
            $errorMsg = if ($result.Errors) { $result.Errors -join "; " } else { $result.Error }
            Show-PIMBuddyToast -Window $Window -Message "Template application failed: $errorMsg" -Type "Error" -DurationMs 5000
            Wizard-Complete -Window $Window -Message "Setup complete but template application had issues. Check the policy settings manually."
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
        Wizard-Complete -Window $Window -Message "Setup complete with errors."
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Wizard-ManualPolicyConfig {
    param([System.Windows.Window]$Window)

    $roleId = $script:WizardState.RoleId
    $roleName = $script:WizardState.RoleName

    # Duration
    $durationResult = Show-InputDialog -Title "Configure: Maximum Duration" `
        -Message "Maximum activation duration in hours (1-24):`n`nRecommendation: 2-4 hours for high-privilege roles, 8 hours for others" `
        -DefaultValue "8" `
        -IsNumeric `
        -MinValue 1 `
        -MaxValue 24 `
        -Owner $Window

    # Validate duration result
    if ($null -eq $durationResult -or $durationResult -isnot [string] -or -not ($durationResult -match '^\d+$')) {
        Wizard-Complete -Window $Window -Message "Setup complete with partial configuration."
        return
    }
    $duration = $durationResult

    # MFA
    $mfaChoice = Show-ChoiceDialog -Title "Configure: MFA Requirement" `
        -Message "Require Multi-Factor Authentication on activation?" `
        -Choices @(
            @{ Label = "Yes (Recommended)"; Description = "Users must complete MFA before activating the role" }
            @{ Label = "No"; Description = "MFA not required (not recommended for sensitive roles)" }
        ) `
        -Owner $Window

    $requireMfa = $mfaChoice -eq 0

    # Justification
    $justChoice = Show-ChoiceDialog -Title "Configure: Justification Requirement" `
        -Message "Require justification text on activation?" `
        -Choices @(
            @{ Label = "Yes (Recommended)"; Description = "Users must provide a reason when activating" }
            @{ Label = "No"; Description = "No justification required" }
        ) `
        -Owner $Window

    $requireJustification = $justChoice -eq 0

    # Apply settings
    Show-PIMBuddyProgress -Window $Window -Message "Applying policy settings..."

    try {
        $result = Set-EntraRoleActivationSettings -RoleDefinitionId $roleId `
            -MaximumDurationHours ([int]$duration) `
            -RequireMfa $requireMfa `
            -RequireJustification $requireJustification

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Policy configured successfully!" -Type "Success"
            Wizard-Complete -Window $Window -Message "PIM setup complete! Custom policy settings applied to '$roleName'."
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed to apply settings: $($result.Error)" -Type "Error" -DurationMs 5000
            Wizard-Complete -Window $Window -Message "Setup complete but policy changes may not have been applied."
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Wizard-CreateCustomTemplate {
    param([System.Windows.Window]$Window)

    $templateNameResult = Show-InputDialog -Title "Create Custom Template" `
        -Message "Enter a name for your custom template:" `
        -DefaultValue "My Custom Template" `
        -Owner $Window

    # Validate template name
    if ($null -eq $templateNameResult -or $templateNameResult -isnot [string] -or [string]::IsNullOrWhiteSpace($templateNameResult)) {
        Wizard-Step3-ConfigurePolicy -Window $Window
        return
    }
    $templateName = [string]$templateNameResult.Trim()

    # Collect settings
    $durationResult = Show-InputDialog -Title "Template: Maximum Duration" `
        -Message "Maximum activation duration in hours (1-24):" `
        -DefaultValue "8" `
        -IsNumeric `
        -MinValue 1 `
        -MaxValue 24 `
        -Owner $Window

    # Validate duration
    if ($null -eq $durationResult -or $durationResult -isnot [string] -or -not ($durationResult -match '^\d+$')) { return }
    $duration = $durationResult

    $mfaChoice = Show-ChoiceDialog -Title "Template: MFA" `
        -Message "Require MFA?" `
        -Choices @(
            @{ Label = "Yes"; Description = "" }
            @{ Label = "No"; Description = "" }
        ) `
        -Owner $Window

    $justChoice = Show-ChoiceDialog -Title "Template: Justification" `
        -Message "Require justification?" `
        -Choices @(
            @{ Label = "Yes"; Description = "" }
            @{ Label = "No"; Description = "" }
        ) `
        -Owner $Window

    $settings = @{
        MaximumDurationHours = [int]$duration
        RequireMfa = $mfaChoice -eq 0
        RequireJustification = $justChoice -eq 0
        RequireApproval = $false
    }

    try {
        $result = New-PIMCustomTemplate -Name $templateName -Description "Created via Setup Wizard" -Settings $settings

        if ($result.Success) {
            Show-PIMBuddyToast -Window $Window -Message "Custom template '$templateName' created!" -Type "Success"

            # Ask if they want to apply it
            $applyChoice = Show-ChoiceDialog -Title "Apply Template?" `
                -Message "Would you like to apply this template to the current role now?" `
                -Choices @(
                    @{ Label = "Yes, apply now"; Description = "" }
                    @{ Label = "No, finish setup"; Description = "" }
                ) `
                -Owner $Window

            if ($applyChoice -eq 0) {
                $script:WizardState.TemplateId = $result.TemplateId
                Wizard-ApplyTemplate -Window $Window
            }
            else {
                Wizard-Complete -Window $Window -Message "Setup complete! Your custom template is saved for future use."
            }
        }
        else {
            Show-PIMBuddyToast -Window $Window -Message "Failed to create template: $($result.Error)" -Type "Error"
        }
    }
    catch {
        Show-PIMBuddyToast -Window $Window -Message "Error: $($_.Exception.Message)" -Type "Error"
    }
}

function Wizard-Complete {
    param(
        [System.Windows.Window]$Window,
        [string]$Message
    )

    $groupName = $script:WizardState.GroupName
    $roleName = $script:WizardState.RoleName

    $summary = @"
$Message

Summary:
- Group: $groupName
- Role: $roleName

Next Steps:
1. Add users to the PIM group as eligible members
2. Users can then activate the role when needed
3. Monitor activations from the Dashboard
"@

    [System.Windows.MessageBox]::Show(
        $summary,
        "Setup Wizard Complete",
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Information
    )

    # Navigate to groups page
    $navGroups = $Window.FindName("NavGroups")
    if ($navGroups) { $navGroups.IsChecked = $true }
}

function Wizard-ShowHelp {
    param([System.Windows.Window]$Window)

    $helpText = @"
Understanding PIM (Privileged Identity Management)

PIM Groups are role-assignable security groups that enable Just-In-Time (JIT) access to privileged roles.

How it works:
1. CREATE a PIM-enabled group
   - These are special security groups that can be assigned to Entra ID roles
   - The group must have 'IsAssignableToRole' enabled (done automatically)

2. ASSIGN the group to an Entra ID role
   - The group becomes 'eligible' for that role
   - Members don't have the role permissions yet

3. CONFIGURE the policy
   - Set requirements like MFA, justification, approval
   - Set maximum activation duration
   - Apply security templates for best practices

4. ADD USERS as eligible members
   - Users join the group as 'eligible' members
   - When they need access, they 'activate' the role

5. ACTIVATION (JIT Access)
   - Users request activation through PIM
   - They complete any required steps (MFA, justification)
   - They get temporary access for the configured duration
   - Access automatically expires

Benefits:
✓ Least privilege - no standing admin access
✓ Audit trail - all activations are logged
✓ Time-bound - access expires automatically
✓ Approval workflows - for sensitive roles
"@

    [System.Windows.MessageBox]::Show(
        $helpText,
        "PIM Setup Guide",
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Information
    )

    # Return to wizard start
    Show-SetupWizard -Window $Window
}

#endregion

#region Export/Import UI

function Export-PIMConfiguration {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    # Get export options
    $exportGroups = $Window.FindName("ExportGroups")
    $exportPolicies = $Window.FindName("ExportPolicies")
    $exportAssignments = $Window.FindName("ExportAssignments")
    $exportFormat = $Window.FindName("ExportFormat")

    $includeGroups = if ($exportGroups) { $exportGroups.IsChecked } else { $true }
    $includePolicies = if ($exportPolicies) { $exportPolicies.IsChecked } else { $true }
    $includeAssignments = if ($exportAssignments) { $exportAssignments.IsChecked } else { $true }
    $format = if ($exportFormat) { $exportFormat.SelectedItem.Content } else { "JSON" }

    # Show save dialog
    $saveDialog = New-Object Microsoft.Win32.SaveFileDialog
    $saveDialog.Title = "Export PIM Configuration"

    if ($format -eq "CSV") {
        $saveDialog.Filter = "CSV files (*.csv)|*.csv"
        $saveDialog.DefaultExt = ".csv"
    }
    else {
        $saveDialog.Filter = "JSON files (*.json)|*.json"
        $saveDialog.DefaultExt = ".json"
    }

    $saveDialog.FileName = "PIMBuddy-Export-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

    if (-not $saveDialog.ShowDialog()) {
        return
    }

    $filePath = $saveDialog.FileName

    Show-PIMBuddyProgress -Window $Window -Message "Exporting configuration..."

    try {
        $exportData = @{
            ExportDate = (Get-Date).ToString("o")
            TenantId = (Get-MgContext).TenantId
            Groups = @()
            Policies = @()
            Assignments = @()
        }

        if ($includeGroups) {
            $groupsResult = Get-PIMGroups -IncludeMemberCount
            if ($groupsResult.Success) {
                $exportData.Groups = $groupsResult.Groups
            }
        }

        if ($includeAssignments -and $exportData.Groups.Count -gt 0) {
            foreach ($group in $exportData.Groups) {
                $details = Get-PIMGroupDetails -GroupId $group.Id
                if ($details.Success) {
                    $exportData.Assignments += @{
                        GroupId = $group.Id
                        GroupName = $group.DisplayName
                        EligibleAssignments = $details.EligibleAssignments
                        ActiveAssignments = $details.ActiveAssignments
                    }
                }
            }
        }

        if ($format -eq "CSV") {
            # For CSV, flatten the data
            $flatData = @()
            foreach ($group in $exportData.Groups) {
                $flatData += [PSCustomObject]@{
                    Type = "Group"
                    Id = $group.Id
                    DisplayName = $group.DisplayName
                    Description = $group.Description
                    MemberCount = $group.MemberCount
                    OwnerCount = $group.OwnerCount
                }
            }
            $flatData | Export-Csv -Path $filePath -NoTypeInformation
        }
        else {
            $exportData | ConvertTo-Json -Depth 10 | Set-Content -Path $filePath
        }

        Show-PIMBuddyToast -Window $Window -Message "Exported to: $filePath" -Type "Success"
        Write-PIMBuddyLog -Message "Configuration exported to: $filePath" -Level "Success"
    }
    catch {
        Write-PIMBuddyLog -Message "Export failed" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Export failed: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

function Import-PIMConfiguration {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window,
        [string]$FilePath
    )

    if (-not $script:IsConnected) {
        Show-PIMBuddyToast -Window $Window -Message "Please connect first" -Type "Warning"
        return
    }

    if (-not (Test-Path $FilePath)) {
        Show-PIMBuddyToast -Window $Window -Message "File not found" -Type "Error"
        return
    }

    Show-PIMBuddyProgress -Window $Window -Message "Importing configuration..."

    try {
        $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()

        if ($extension -eq ".csv") {
            $data = Import-Csv -Path $FilePath
            $groupCount = ($data | Where-Object { $_.Type -eq "Group" }).Count
            Show-PIMBuddyToast -Window $Window -Message "Loaded $groupCount groups from CSV" -Type "Info"
        }
        else {
            $data = Get-Content -Path $FilePath -Raw | ConvertFrom-Json

            if ($data.Groups) {
                $confirm = [System.Windows.MessageBox]::Show(
                    "Import will create $($data.Groups.Count) groups.`n`nContinue?",
                    "Confirm Import",
                    [System.Windows.MessageBoxButton]::YesNo,
                    [System.Windows.MessageBoxImage]::Question
                )

                if ($confirm -eq [System.Windows.MessageBoxResult]::Yes) {
                    $created = 0
                    $failed = 0

                    foreach ($group in $data.Groups) {
                        try {
                            $mailNickname = if ($group.MailNickname) { $group.MailNickname } else { $group.DisplayName -replace '[^a-zA-Z0-9_-]', '' }
                            if ([string]::IsNullOrWhiteSpace($mailNickname)) {
                                $mailNickname = "PIMGroup-" + (Get-Random -Maximum 9999)
                            }
                            $description = if ($group.Description) { $group.Description } else { "Imported by PIMBuddy" }

                            $result = New-PIMGroup -DisplayName $group.DisplayName `
                                -MailNickname $mailNickname `
                                -Description $description `
                                -Confirm:$false

                            if ($result.Success) {
                                $created++
                                Write-PIMBuddyLog -Message "Imported group: $($group.DisplayName)" -Level "Debug"
                            } else {
                                $failed++
                                Write-PIMBuddyLog -Message "Failed to import group $($group.DisplayName): $($result.Error)" -Level "Warning"
                            }
                        }
                        catch {
                            $failed++
                            Write-PIMBuddyLog -Message "Exception importing group $($group.DisplayName): $($_.Exception.Message)" -Level "Warning"
                        }
                    }

                    Show-PIMBuddyToast -Window $Window -Message "Import complete: $created created, $failed failed" -Type "Success"
                    Refresh-GroupsList -Window $Window
                    Refresh-DashboardData -Window $Window
                }
            }
        }
    }
    catch {
        Write-PIMBuddyLog -Message "Import failed" -Level "Error" -Exception $_.Exception
        Show-PIMBuddyToast -Window $Window -Message "Import failed: $($_.Exception.Message)" -Type "Error"
    }
    finally {
        Show-PIMBuddyProgress -Window $Window -Hide
    }
}

#endregion

#region Template Loading

function Find-ParentButton {
    param($element)

    $current = $element
    while ($current) {
        if ($current -is [System.Windows.Controls.Button]) {
            return $current
        }
        $current = [System.Windows.Media.VisualTreeHelper]::GetParent($current)
    }
    return $null
}

function Load-Templates {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    try {
        $templatesList = $Window.FindName("TemplatesList")
        if (-not $templatesList) { return }

        # Use PSCustomObjects for proper WPF data binding (hashtables don't bind correctly)
        $script:AvailableTemplates = @(
            [PSCustomObject]@{
                Id = "secure-admin"
                Name = "Secure Admin Access"
                Description = "Microsoft recommended settings: 8-hour max activation, MFA required, justification required."
                Icon = [string][char]0xE72E
            },
            [PSCustomObject]@{
                Id = "zero-trust"
                Name = "Zero Trust Security"
                Description = "Maximum security: 4-hour max, MFA + approval required, no permanent assignments."
                Icon = [string][char]0xE72E
            },
            [PSCustomObject]@{
                Id = "contractor"
                Name = "Contractor/External Access"
                Description = "Restricted access: 2-hour max, approval required, 90-day max assignment."
                Icon = [string][char]0xE716
            },
            [PSCustomObject]@{
                Id = "break-glass"
                Name = "Break Glass Accounts"
                Description = "Emergency access: Permanent eligible allowed, strong monitoring, no approval."
                Icon = [string][char]0xE7BA
            },
            [PSCustomObject]@{
                Id = "devops"
                Name = "Developer/DevOps Access"
                Description = "Flexible settings: 12-hour max, MFA required, justification only."
                Icon = [string][char]0xE943
            }
        )

        $templatesList.ItemsSource = $script:AvailableTemplates

        # Handle button clicks - walk up visual tree to find the actual button
        $templatesList.AddHandler(
            [System.Windows.UIElement]::PreviewMouseLeftButtonUpEvent,
            [System.Windows.Input.MouseButtonEventHandler]{
                param($sender, $e)
                $source = $e.OriginalSource
                $button = Find-ParentButton -element $source

                if ($button -and $button.Tag) {
                    $templateId = $button.Tag.ToString()
                    Write-PIMBuddyLog -Message "Template button clicked: $templateId" -Level "Debug"
                    Apply-SelectedTemplate -Window $script:MainWindow -TemplateId $templateId
                    $e.Handled = $true
                }
            }
        )

        Write-PIMBuddyLog -Message "Templates UI loaded successfully" -Level "Debug"
    }
    catch {
        Write-PIMBuddyLog -Message "Error loading templates UI: $($_.Exception.Message)" -Level "Warning"
    }
}

#endregion

#region Main Window Setup

function Initialize-MainWindow {
    param(
        [Parameter(Mandatory)]
        [System.Windows.Window]$Window
    )

    Write-PIMBuddyLog -Message "Initializing main window..." -Level "Debug"

    # Store window reference at script level for event handlers
    $script:MainWindow = $Window

    # Set initial theme
    Set-Theme -Theme $script:Settings.Theme -Window $Window

    # Store navigation mapping at script level
    $script:NavPageMap = @{
        "NavDashboard" = "DashboardPage"
        "NavGroups" = "GroupsPage"
        "NavPolicies" = "PoliciesPage"
        "NavRoles" = "RolesPage"
        "NavTemplates" = "TemplatesPage"
        "NavExport" = "ExportPage"
        "NavSettings" = "SettingsPage"
    }

    # Wire up navigation using a common handler
    foreach ($navName in $script:NavPageMap.Keys) {
        $radioButton = $Window.FindName($navName)
        if ($radioButton) {
            # Use the Name property (not Tag - Tag is used for icons in XAML)
            $radioButton.Add_Checked({
                param($s, $ev)
                $navKey = $s.Name
                $pageName = $script:NavPageMap[$navKey]
                if ($pageName) {
                    Set-ActivePage -Window $script:MainWindow -PageName $pageName
                }
            })
        }
    }

    # Wire up theme toggle
    $themeToggle = $Window.FindName("ThemeToggleButton")
    if ($themeToggle) {
        $themeToggle.Add_Click({
            $newTheme = if ($script:CurrentTheme -eq "Light") { "Dark" } else { "Light" }
            Set-Theme -Theme $newTheme -Window $script:MainWindow
        })
    }

    # Wire up connect button
    $connectButton = $Window.FindName("ConnectButton")
    if ($connectButton) {
        $connectButton.Add_Click({
            if ($script:IsConnected) {
                Disconnect-FromGraph -Window $script:MainWindow
            }
            else {
                Connect-ToGraph -Window $script:MainWindow
            }
        })
    }

    # Wire up settings controls
    $themeSelector = $Window.FindName("ThemeSelector")
    if ($themeSelector) {
        $themeSelector.SelectedIndex = if ($script:Settings.Theme -eq "Light") { 0 } else { 1 }
        $themeSelector.Add_SelectionChanged({
            param($s, $ev)
            $selected = if ($s.SelectedIndex -eq 0) { "Light" } else { "Dark" }
            Set-Theme -Theme $selected -Window $script:MainWindow
        })
    }

    $cloudEnvSelector = $Window.FindName("CloudEnvironmentSelector")
    if ($cloudEnvSelector) {
        $envIndex = switch ($script:Settings.CloudEnvironment) {
            "Commercial" { 0 }
            "GCC" { 1 }
            "GCC-High" { 2 }
            "DoD" { 3 }
            default { 0 }
        }
        $cloudEnvSelector.SelectedIndex = $envIndex
        $cloudEnvSelector.Add_SelectionChanged({
            param($s, $ev)
            $selected = switch ($s.SelectedIndex) {
                0 { "Commercial" }
                1 { "GCC" }
                2 { "GCC-High" }
                3 { "DoD" }
            }
            $script:Settings.CloudEnvironment = $selected
            Save-PIMBuddySettings -Settings $script:Settings
        })
    }

    $durationSlider = $Window.FindName("DefaultDurationSlider")
    $durationValue = $Window.FindName("DefaultDurationValue")
    if ($durationSlider -and $durationValue) {
        $durationSlider.Value = $script:Settings.DefaultActivationDuration
        $durationValue.Text = "$($script:Settings.DefaultActivationDuration)h"
        $durationSlider.Add_ValueChanged({
            param($s, $ev)
            $value = [int]$s.Value
            $durationLabel = $script:MainWindow.FindName("DefaultDurationValue")
            if ($durationLabel) {
                $durationLabel.Text = "${value}h"
            }
            $script:Settings.DefaultActivationDuration = $value
            Save-PIMBuddySettings -Settings $script:Settings
        })
    }

    # Wire up quick actions
    $quickSetupWizard = $Window.FindName("QuickSetupWizard")
    if ($quickSetupWizard) {
        $quickSetupWizard.Add_Click({
            Show-SetupWizard -Window $script:MainWindow
        })
    }

    $quickCreateGroup = $Window.FindName("QuickCreateGroup")
    if ($quickCreateGroup) {
        $quickCreateGroup.Add_Click({
            Show-CreateGroupDialog -Window $script:MainWindow
        })
    }

    $quickApplyTemplate = $Window.FindName("QuickApplyTemplate")
    if ($quickApplyTemplate) {
        $quickApplyTemplate.Add_Click({
            $navTemplates = $script:MainWindow.FindName("NavTemplates")
            if ($navTemplates) { $navTemplates.IsChecked = $true }
        })
    }

    # Wire up export button
    $exportButton = $Window.FindName("ExportButton")
    if ($exportButton) {
        $exportButton.Add_Click({
            Export-PIMConfiguration -Window $script:MainWindow
        })
    }

    # Wire up import button
    $importButton = $Window.FindName("ImportBrowseButton")
    if ($importButton) {
        $importButton.Add_Click({
            $dialog = New-Object Microsoft.Win32.OpenFileDialog
            $dialog.Filter = "JSON files (*.json)|*.json|CSV files (*.csv)|*.csv|All files (*.*)|*.*"
            $dialog.Title = "Select file to import"

            if ($dialog.ShowDialog()) {
                $filePath = $dialog.FileName
                Import-PIMConfiguration -Window $script:MainWindow -FilePath $filePath
            }
        })
    }

    # Wire up Groups page buttons
    $createGroupButton = $Window.FindName("CreateGroupButton")
    if ($createGroupButton) {
        $createGroupButton.Add_Click({
            Show-CreateGroupDialog -Window $script:MainWindow
        })
    }

    $refreshGroupsButton = $Window.FindName("RefreshGroupsButton")
    if ($refreshGroupsButton) {
        $refreshGroupsButton.Add_Click({
            Refresh-GroupsList -Window $script:MainWindow
        })
    }

    # Wire up groups DataGrid selection and context menu
    $groupsDataGrid = $Window.FindName("GroupsDataGrid")
    if ($groupsDataGrid) {
        $groupsDataGrid.Add_MouseDoubleClick({
            param($s, $ev)
            if ($s.SelectedItem) {
                # Double-click opens management menu
                Show-GroupManagementMenu -Window $script:MainWindow
            }
        })
    }

    # Wire up groups edit button
    $editGroupButton = $Window.FindName("EditGroupButton")
    if ($editGroupButton) {
        $editGroupButton.Add_Click({
            Show-GroupManagementMenu -Window $script:MainWindow
        })
    }

    # Wire up Groups search box
    $groupSearchBox = $Window.FindName("GroupSearchBox")
    if ($groupSearchBox) {
        $groupSearchBox.Add_TextChanged({
            param($s, $ev)
            Filter-GroupsList -Window $script:MainWindow -SearchText $s.Text
        })
    }

    # Wire up Roles page refresh button
    $refreshRolesButton = $Window.FindName("RefreshRolesButton")
    if ($refreshRolesButton) {
        $refreshRolesButton.Add_Click({
            Refresh-RolesList -Window $script:MainWindow -ForceRefresh
        })
    }

    # Wire up Roles search box
    $roleSearchBox = $Window.FindName("RoleSearchBox")
    if ($roleSearchBox) {
        $roleSearchBox.Add_TextChanged({
            param($s, $ev)
            Filter-RolesList -Window $script:MainWindow -SearchText $s.Text
        })
    }

    # Wire up Roles page
    $rolesDataGrid = $Window.FindName("RolesDataGrid")
    if ($rolesDataGrid) {
        $rolesDataGrid.Add_MouseDoubleClick({
            param($s, $ev)
            if ($s.SelectedItem) {
                # Double-click opens assign group dialog
                Show-AssignGroupToRoleDialog -Window $script:MainWindow
            }
        })

        # Also wire up the button clicks in the DataGrid
        $rolesDataGrid.Add_Loaded({
            param($s, $ev)
            # We need to handle button clicks in the DataGrid cells
            # This is done via routed events
        })
    }

    # Wire up Roles page assign button (add a toolbar button)
    $assignRoleButton = $Window.FindName("AssignRoleButton")
    if ($assignRoleButton) {
        $assignRoleButton.Add_Click({
            Show-AssignGroupToRoleDialog -Window $script:MainWindow
        })
    }

    # Wire up Policies page
    $policyTargetList = $Window.FindName("PolicyTargetList")
    if ($policyTargetList) {
        $policyTargetList.Add_SelectionChanged({
            param($s, $ev)
            if ($s.SelectedItem) {
                $target = $s.SelectedItem
                Load-PolicyForTarget -Window $script:MainWindow -TargetId $target.Id -TargetType $target.Type
            }
        })
    }

    # Wire up Policies refresh button
    $refreshPoliciesButton = $Window.FindName("RefreshPoliciesButton")
    if ($refreshPoliciesButton) {
        $refreshPoliciesButton.Add_Click({
            Refresh-PolicyTargets -Window $script:MainWindow -ForceRefresh
        })
    }

    # Wire up Policies search box
    $policySearchBox = $Window.FindName("PolicySearchBox")
    if ($policySearchBox) {
        $policySearchBox.Add_TextChanged({
            param($s, $ev)
            Filter-PolicyTargets -Window $script:MainWindow -SearchText $s.Text
        })
    }

    # Templates are wired up in Load-Templates function

    # Wire up Export button (the real one in Export page)
    $exportPageButton = $Window.FindName("ExportButton")
    if ($exportPageButton) {
        $exportPageButton.Add_Click({
            Export-PIMConfiguration -Window $script:MainWindow
        })
    }

    # Wire up navigation change to load data for each page
    $navGroups = $Window.FindName("NavGroups")
    if ($navGroups) {
        $navGroups.Add_Checked({
            if ($script:IsConnected) {
                Refresh-GroupsList -Window $script:MainWindow
            }
        })
    }

    $navRoles = $Window.FindName("NavRoles")
    if ($navRoles) {
        $navRoles.Add_Checked({
            if ($script:IsConnected) {
                Refresh-RolesList -Window $script:MainWindow
            }
        })
    }

    $navPolicies = $Window.FindName("NavPolicies")
    if ($navPolicies) {
        $navPolicies.Add_Checked({
            if ($script:IsConnected) {
                Refresh-PolicyTargets -Window $script:MainWindow
            }
        })
    }

    # Load templates
    Load-Templates -Window $Window

    # Initialize keyboard shortcuts
    Initialize-KeyboardShortcuts -Window $Window

    # Wire up Advanced Actions button (if exists in XAML)
    $advancedActionsButton = $Window.FindName("AdvancedActionsButton")
    if ($advancedActionsButton) {
        $advancedActionsButton.Add_Click({
            Show-AdvancedActionsMenu -Window $script:MainWindow
        })
    }

    # Wire up Global Search button (if exists in XAML)
    $globalSearchButton = $Window.FindName("GlobalSearchButton")
    if ($globalSearchButton) {
        $globalSearchButton.Add_Click({
            Show-GlobalSearchDialog -Window $script:MainWindow
        })
    }

    # Wire up Copy Policy button on Groups page (if exists)
    $copyPolicyButton = $Window.FindName("CopyPolicyButton")
    if ($copyPolicyButton) {
        $copyPolicyButton.Add_Click({
            Show-CopyPolicyDialog -Window $script:MainWindow
        })
    }

    # Wire up Compliance Report button (if exists)
    $complianceButton = $Window.FindName("ComplianceReportButton")
    if ($complianceButton) {
        $complianceButton.Add_Click({
            Show-ComplianceReportDialog -Window $script:MainWindow
        })
    }

    # Set initial connection state
    Update-ConnectionUI -Window $Window -Connected $false

    Write-PIMBuddyLog -Message "Main window initialized" -Level "Success"
}

#endregion

#region Application Entry Point

Write-Host "`nStarting PIMBuddy..." -ForegroundColor Cyan

try {
    # Load main window XAML
    $mainWindowPath = Join-Path $script:AppRoot "GUI\MainWindow.xaml"
    if (-not (Test-Path $mainWindowPath)) {
        throw "MainWindow.xaml not found at: $mainWindowPath"
    }

    $window = Load-Xaml -XamlPath $mainWindowPath

    # Initialize window
    Initialize-MainWindow -Window $window

    # Show window
    Write-Host "PIMBuddy started successfully!`n" -ForegroundColor Green
    $window.ShowDialog() | Out-Null
}
catch {
    Write-PIMBuddyLog -Message "Fatal error starting PIMBuddy" -Level "Error" -Exception $_.Exception
    Write-Host "`nFatal Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack Trace: $($_.Exception.StackTrace)" -ForegroundColor DarkGray

    [System.Windows.MessageBox]::Show(
        "Failed to start PIMBuddy:`n`n$($_.Exception.Message)",
        "PIMBuddy Error",
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Error
    ) | Out-Null
}
finally {
    Write-PIMBuddyLog -Message "PIMBuddy shutting down" -Level "Info"
    # PERFORMANCE: Flush any remaining buffered log entries
    if (Get-Command -Name Flush-LogBuffer -ErrorAction SilentlyContinue) {
        Flush-LogBuffer
    }
}

#endregion
