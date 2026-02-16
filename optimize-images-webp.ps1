# Image Optimization Script - Convert to WebP and Optimize Sizes
# This script converts images to WebP format for better compression

Write-Host "Starting Image Optimization..." -ForegroundColor Green
Write-Host ""

# Check if magick (ImageMagick) is available
$magickAvailable = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickAvailable) {
    Write-Host "ImageMagick not found. Installing via winget..." -ForegroundColor Yellow
    winget install ImageMagick.ImageMagick
    Write-Host "Please restart PowerShell and run this script again." -ForegroundColor Yellow
    exit
}

# Function to convert image to WebP
function ConvertTo-WebP {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 85
    )
    
    if (Test-Path $InputPath) {
        Write-Host "Converting: $InputPath -> $OutputPath" -ForegroundColor Cyan
        magick $InputPath -quality $Quality $OutputPath
        
        $originalSize = (Get-Item $InputPath).Length / 1KB
        $webpSize = (Get-Item $OutputPath).Length / 1KB
        $savings = [math]::Round((($originalSize - $webpSize) / $originalSize) * 100, 2)
        
        Write-Host "  Original: $([math]::Round($originalSize, 2)) KB" -ForegroundColor Gray
        Write-Host "  WebP: $([math]::Round($webpSize, 2)) KB" -ForegroundColor Gray
        Write-Host "  Savings: $savings%" -ForegroundColor Green
        Write-Host ""
    }
}

# Convert hero images (most critical for LCP)
Write-Host "=== Converting Hero Images ===" -ForegroundColor Yellow
ConvertTo-WebP -InputPath "images/hero-bg-desktop.jpg" -OutputPath "images/hero-bg-desktop.webp" -Quality 85
ConvertTo-WebP -InputPath "images/hero-bg-mobile.jpg" -OutputPath "images/hero-bg-mobile.webp" -Quality 85

# Convert car fleet images
Write-Host "=== Converting Fleet Images ===" -ForegroundColor Yellow
$carImages = @("dezire.jpg", "ertiga.jpg", "crista.jpeg", "aura.jpg", "bmw.jpg", "audi.jpg")
foreach ($car in $carImages) {
    $input = "images/$car"
    $output = "images/$($car.Replace('.jpg', '.webp').Replace('.jpeg', '.webp'))"
    ConvertTo-WebP -InputPath $input -OutputPath $output -Quality 80
}

# Convert logo
Write-Host "=== Converting Logo ===" -ForegroundColor Yellow
ConvertTo-WebP -InputPath "images/carrentalranchilog.jpeg" -OutputPath "images/carrentalranchilog.webp" -Quality 85

# Optimize favicon sizes (they're too big - 378KB!)
Write-Host "=== Optimizing Favicons ===" -ForegroundColor Yellow
Write-Host "Compressing favicon-512x512.png..." -ForegroundColor Cyan
magick images/favicon-512x512.png -strip -quality 85 -define png:compression-level=9 images/favicon-512x512-optimized.png
magick images/android-chrome-512x512.png -strip -quality 85 -define png:compression-level=9 images/android-chrome-512x512-optimized.png

$originalFavicon = (Get-Item "images/favicon-512x512.png").Length / 1KB
$optimizedFavicon = (Get-Item "images/favicon-512x512-optimized.png").Length / 1KB
Write-Host "  Original: $([math]::Round($originalFavicon, 2)) KB" -ForegroundColor Gray
Write-Host "  Optimized: $([math]::Round($optimizedFavicon, 2)) KB" -ForegroundColor Gray
Write-Host "  Savings: $([math]::Round((($originalFavicon - $optimizedFavicon) / $originalFavicon) * 100, 2))%" -ForegroundColor Green
Write-Host ""

# Calculate total savings
Write-Host "=== Summary ===" -ForegroundColor Green
$totalOriginal = 0
$totalWebP = 0

Get-ChildItem -Path "images" -Filter "*.jpg" | ForEach-Object {
    $webpFile = $_.FullName.Replace('.jpg', '.webp')
    if (Test-Path $webpFile) {
        $totalOriginal += $_.Length / 1KB
        $totalWebP += (Get-Item $webpFile).Length / 1KB
    }
}

Get-ChildItem -Path "images" -Filter "*.jpeg" | ForEach-Object {
    $webpFile = $_.FullName.Replace('.jpeg', '.webp')
    if (Test-Path $webpFile) {
        $totalOriginal += $_.Length / 1KB
        $totalWebP += (Get-Item $webpFile).Length / 1KB
    }
}

$totalSavings = $totalOriginal - $totalWebP
$percentSavings = [math]::Round(($totalSavings / $totalOriginal) * 100, 2)

Write-Host "Total Original Size: $([math]::Round($totalOriginal, 2)) KB" -ForegroundColor Cyan
Write-Host "Total WebP Size: $([math]::Round($totalWebP, 2)) KB" -ForegroundColor Cyan
Write-Host "Total Savings: $([math]::Round($totalSavings, 2)) KB ($percentSavings%)" -ForegroundColor Green
Write-Host ""
Write-Host "Image optimization complete!" -ForegroundColor Green
Write-Host "Next: Update HTML to use WebP with fallback" -ForegroundColor Yellow
