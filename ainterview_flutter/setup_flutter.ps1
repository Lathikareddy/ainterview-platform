# AInterview Flutter - Complete Setup Script
# Run this script as Administrator in PowerShell
# Usage: Right-click -> Run with PowerShell (as Admin)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  AInterview Flutter Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$FlutterInstallDir = "C:\flutter"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FlutterExe = "$FlutterInstallDir\bin\flutter.bat"

# ── Step 1: Install Flutter SDK ─────────────────────────────────────────────
if (Test-Path $FlutterExe) {
    Write-Host "`n[✓] Flutter SDK already found at $FlutterInstallDir" -ForegroundColor Green
} else {
    Write-Host "`n[1/4] Downloading Flutter SDK 3.22.x..." -ForegroundColor Yellow
    $flutterZip = "$env:TEMP\flutter_windows.zip"
    $downloadUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.22.3-stable.zip"
    
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $flutterZip -UseBasicParsing
        Write-Host "[✓] Downloaded Flutter SDK" -ForegroundColor Green
    } catch {
        Write-Host "[✗] Failed to download Flutter. Please download manually from https://flutter.dev/docs/get-started/install/windows" -ForegroundColor Red
        exit 1
    }

    Write-Host "[1/4] Extracting Flutter to C:\flutter..." -ForegroundColor Yellow
    Expand-Archive -Path $flutterZip -DestinationPath "C:\" -Force
    Write-Host "[✓] Flutter extracted to C:\flutter" -ForegroundColor Green
    Remove-Item $flutterZip -Force
}

# ── Step 2: Add Flutter to PATH ──────────────────────────────────────────────
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*C:\flutter\bin*") {
    Write-Host "`n[2/4] Adding Flutter to system PATH..." -ForegroundColor Yellow
    [System.Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;C:\flutter\bin",
        "Machine"
    )
    $env:PATH += ";C:\flutter\bin"
    Write-Host "[✓] Flutter added to PATH" -ForegroundColor Green
} else {
    Write-Host "`n[2/4] Flutter already in PATH" -ForegroundColor Green
    $env:PATH += ";C:\flutter\bin"
}

# ── Step 3: Scaffold Android platform ────────────────────────────────────────
Write-Host "`n[3/4] Scaffolding Flutter Android platform..." -ForegroundColor Yellow
Set-Location $ProjectDir

# Create a temp project to get platform files
$tempDir = "$env:TEMP\ainterview_temp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

& "$FlutterExe" create --org "com.ainterview" --project-name "ainterview" --platforms android $tempDir 2>&1 | Out-Null

if (Test-Path "$tempDir\android") {
    # Copy android folder to our project
    if (Test-Path "$ProjectDir\android") { Remove-Item "$ProjectDir\android" -Recurse -Force }
    Copy-Item "$tempDir\android" "$ProjectDir\android" -Recurse
    Write-Host "[✓] Android platform files created" -ForegroundColor Green
    
    # Copy other required platform files
    foreach ($f in @('.gitignore', '.metadata', 'analysis_options.yaml')) {
        if (Test-Path "$tempDir\$f") {
            Copy-Item "$tempDir\$f" "$ProjectDir\$f" -Force
        }
    }
    
    Remove-Item $tempDir -Recurse -Force
} else {
    Write-Host "[✗] Failed to scaffold Android. Run 'flutter create .' manually." -ForegroundColor Red
}

# ── Step 4: Get dependencies ─────────────────────────────────────────────────
Write-Host "`n[4/4] Getting Flutter dependencies..." -ForegroundColor Yellow
& "$FlutterExe" pub get

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Open project in Android Studio or VS Code" -ForegroundColor White
Write-Host "  2. Connect your Android phone (enable USB Debugging)" -ForegroundColor White
Write-Host "  3. Run: flutter run" -ForegroundColor White
Write-Host "  4. Or build APK: flutter build apk --release" -ForegroundColor White
Write-Host "`nFirebase Setup:" -ForegroundColor Cyan
Write-Host "  - Ensure google-services.json is in android/app/" -ForegroundColor White
Write-Host "  - Get it from Firebase Console -> Project Settings -> Android app" -ForegroundColor White
