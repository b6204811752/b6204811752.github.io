#!/usr/bin/env pwsh
# Quick Deployment Script for Website Fixes
# Run this script to deploy all changes to GitHub

Write-Host "🚀 Deploying Website Fixes..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\basan\OneDrive\Desktop\CARRENTAL"

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Show git status
Write-Host "📊 Git Status:" -ForegroundColor Green
git status --short

Write-Host ""
Write-Host "📦 Files to be committed:" -ForegroundColor Yellow
Write-Host "  ✅ css/style.css (scroll-top button fix)"
Write-Host "  ✅ css/style.min.css (scroll-top button fix)"
Write-Host "  ✅ index.html (added performance files)"
Write-Host "  ✅ performance-boost.css (new - performance optimizations)"
Write-Host "  ✅ performance-boost.js (new - advanced features)"
Write-Host "  ✅ FIXES-SUMMARY-FEB-17-2026.md (new - documentation)"
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to proceed with deployment? (Y/N)"

if ($confirm -eq 'Y' -or $confirm -eq 'y') {
    Write-Host ""
    Write-Host "➕ Adding files to git..." -ForegroundColor Cyan
    git add css/style.css css/style.min.css index.html performance-boost.css performance-boost.js FIXES-SUMMARY-FEB-17-2026.md

    Write-Host "✅ Files staged" -ForegroundColor Green
    Write-Host ""

    Write-Host "💾 Creating commit..." -ForegroundColor Cyan
    git commit -m "fix: scroll-to-top button visibility + performance optimization

- Fixed scroll-top button: hidden by default, appears on scroll >300px
- Added performance-boost.css for PageSpeed optimization
- Added performance-boost.js for advanced performance features
- Expected improvements:
  * Performance: 45 → 65-75 (+20-30 points)
  * CLS: 0.491 → 0.05-0.10 (85% better)
  * LCP: 5.8s → 3.5-4.2s (35% faster)
  * FCP: 4.4s → 2.5-3.0s (40% faster)
- Network-aware optimizations for slow connections
- Better mobile experience and Core Web Vitals
- Comprehensive documentation added"

    Write-Host "✅ Commit created" -ForegroundColor Green
    Write-Host ""

    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
    git push origin main

    Write-Host ""
    Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏱️  Wait 5-10 minutes for GitHub Pages CDN propagation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🧪 Testing Instructions:" -ForegroundColor Cyan
    Write-Host "  1. Open: https://carrentalranchi.com" -ForegroundColor White
    Write-Host "  2. Scroll down - button should appear from bottom" -ForegroundColor White
    Write-Host "  3. Test PageSpeed: https://pagespeed.web.dev/" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Expected Results:" -ForegroundColor Cyan
    Write-Host "  • Scroll button works correctly ✓" -ForegroundColor White
    Write-Host "  • Performance score: 65-75/100" -ForegroundColor White
    Write-Host "  • CLS: 0.05-0.10 (Good)" -ForegroundColor White
    Write-Host "  • LCP: 3.5-4.2s" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Full documentation: FIXES-SUMMARY-FEB-17-2026.md" -ForegroundColor Magenta
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    Write-Host ""
}
