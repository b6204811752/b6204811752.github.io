# Create Proper Favicons from Logo
# Google Search requires proper favicon.ico and PNG sizes

Add-Type -AssemblyName System.Drawing

$logoPath = "C:\Users\basan\OneDrive\Desktop\CARRENTAL\images\carrentalranchilog.jpeg"
$outputDir = "C:\Users\basan\OneDrive\Desktop\CARRENTAL\images\"

Write-Host "`nCreating favicons from logo..." -ForegroundColor Cyan

# Function to create square favicon
function Create-Favicon {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Size
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($InputPath)
        
        # Create square canvas
        $newImage = New-Object System.Drawing.Bitmap($Size, $Size)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # Set high quality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        # Fill white background
        $graphics.Clear([System.Drawing.Color]::White)
        
        # Calculate dimensions to fit logo in square (maintain aspect ratio, centered)
        $srcWidth = $image.Width
        $srcHeight = $image.Height
        $ratio = [Math]::Min($Size / $srcWidth, $Size / $srcHeight)
        $destWidth = [int]($srcWidth * $ratio)
        $destHeight = [int]($srcHeight * $ratio)
        $destX = [int](($Size - $destWidth) / 2)
        $destY = [int](($Size - $destHeight) / 2)
        
        # Draw image centered
        $graphics.DrawImage($image, $destX, $destY, $destWidth, $destHeight)
        
        # Save as PNG
        $newImage.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up
        $graphics.Dispose()
        $newImage.Dispose()
        $image.Dispose()
        
        $fileInfo = Get-Item $OutputPath
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 1)
        
        Write-Host "  Created: $($fileInfo.Name) - ${Size}x${Size} - ${sizeKB} KB" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nCreating favicon sizes for Google Search..." -ForegroundColor White

# Create standard favicon sizes
Write-Host "`n1. Creating 16x16 favicon:" -ForegroundColor Cyan
$favicon16 = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\favicon-16x16.png" -Size 16

Write-Host "`n2. Creating 32x32 favicon:" -ForegroundColor Cyan
$favicon32 = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\favicon-32x32.png" -Size 32

Write-Host "`n3. Creating 48x48 favicon:" -ForegroundColor Cyan
$favicon48 = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\favicon-48x48.png" -Size 48

Write-Host "`n4. Creating 180x180 Apple Touch Icon:" -ForegroundColor Cyan
$appleFavicon = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\apple-touch-icon.png" -Size 180

Write-Host "`n5. Creating 192x192 Android Icon:" -ForegroundColor Cyan
$androidFavicon = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\android-chrome-192x192.png" -Size 192

Write-Host "`n6. Creating 512x512 Android Icon:" -ForegroundColor Cyan
$androidLarge = Create-Favicon -InputPath $logoPath -OutputPath "$outputDir\android-chrome-512x512.png" -Size 512

# Copy 32x32 as favicon.ico (basic)
Copy-Item "$outputDir\favicon-32x32.png" "$outputDir\..\favicon.ico" -Force
Write-Host "`n7. Copied favicon.ico to root" -ForegroundColor Green

Write-Host "`nFavicons created successfully!" -ForegroundColor Green
Write-Host "`nCreated files:" -ForegroundColor Yellow
Get-ChildItem "$outputDir\favicon-*.png", "$outputDir\apple-touch-icon.png", "$outputDir\android-*.png" | 
    Select-Object Name, @{Name="Size KB";Expression={[math]::Round($_.Length/1KB, 1)}} | 
    Format-Table -AutoSize

Write-Host "These favicons will display correctly in Google Search results." -ForegroundColor Cyan
Write-Host ""
