# Quick IndexNow Submission Script
# This submits your URLs to Bing, Yandex, and other search engines instantly

Write-Host "`n🚀 INDEXNOW - INSTANT SEARCH ENGINE SUBMISSION" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$indexNowKey = "a8b3f9c2e1d4567890abcdef12345678"
$domain = "carrentalranchi.com"

# Top 10 most important URLs
$urls = @(
    "https://carrentalranchi.com/",
    "https://carrentalranchi.com/ranchi-local-taxi.html",
    "https://carrentalranchi.com/ranchi-airport-taxi.html",
    "https://carrentalranchi.com/ranchi-to-patna-taxi.html",
    "https://carrentalranchi.com/ranchi-to-kolkata-taxi.html",
    "https://carrentalranchi.com/ranchi-to-jamshedpur-taxi.html",
    "https://carrentalranchi.com/ranchi-to-bokaro-taxi.html",
    "https://carrentalranchi.com/ranchi-to-dhanbad-taxi.html",
    "https://carrentalranchi.com/corporate-taxi-ranchi.html",
    "https://carrentalranchi.com/ranchi-local-sightseeing.html"
)

Write-Host "`nSubmitting $($urls.Count) URLs to IndexNow..." -ForegroundColor Yellow
Write-Host ""

# Create JSON payload
$body = @{
    host = $domain
    key = $indexNowKey
    keyLocation = "https://$domain/indexnow-key.txt"
    urlList = $urls
} | ConvertTo-Json

Write-Host "URLs to submit:" -ForegroundColor Green
foreach ($url in $urls) {
    Write-Host "  - $url" -ForegroundColor Gray
}
Write-Host ""

# Submit to IndexNow API
try {
    Write-Host "Submitting to IndexNow API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ SUCCESS! URLs submitted to IndexNow" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your URLs are now being indexed by:" -ForegroundColor Cyan
    Write-Host "  • Microsoft Bing" -ForegroundColor White
    Write-Host "  • Yandex" -ForegroundColor White
    Write-Host "  • Seznam.cz" -ForegroundColor White
    Write-Host "  • Naver" -ForegroundColor White
    Write-Host ""
    Write-Host "Expected indexing time: 1-2 hours on Bing!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check indexing status:" -ForegroundColor Yellow
    Write-Host "  Bing: site:carrentalranchi.com" -ForegroundColor Gray
    Write-Host "  URL: https://www.bing.com/search?q=site:carrentalranchi.com" -ForegroundColor Gray
} catch {
    # IndexNow returns 200/202 even without response body, so silence errors
    if ($_.Exception.Response.StatusCode -in @(200, 202)) {
        Write-Host "✅ SUCCESS! URLs submitted to IndexNow" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
        Write-Host "Your URLs are being indexed by Bing, Yandex, and partners" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Check in 1-2 hours: https://www.bing.com/search?q=site:carrentalranchi.com" -ForegroundColor Yellow
    } else {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative: Submit manually at:" -ForegroundColor Yellow
        Write-Host "  https://www.bing.com/indexnow" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "✨ IndexNow submission complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Verify Google Search Console" -ForegroundColor White
Write-Host "   https://search.google.com/search-console" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Submit sitemap to Google" -ForegroundColor White
Write-Host "   Add sitemap: sitemap.xml" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Request indexing via URL Inspection" -ForegroundColor White
Write-Host "   Request indexing for homepage" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Create Google My Business listing" -ForegroundColor White
Write-Host "   https://business.google.com" -ForegroundColor Gray
Write-Host ""
Write-Host "See full guide: GOOGLE-INDEXING-GUIDE.md" -ForegroundColor Cyan
Write-Host ""
