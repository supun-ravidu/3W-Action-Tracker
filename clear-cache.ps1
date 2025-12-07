# Complete Cache Clearing Script for Firestore Quota Issues
# Run this script to clear all browser caches and restart the dev server

Write-Host "🧹 Starting Complete Cache Clear Process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Node processes
Write-Host "1️⃣ Stopping all Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ Node processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Clear Next.js cache
Write-Host "2️⃣ Clearing Next.js build cache..." -ForegroundColor Yellow
if (Test-Path ".\.next") {
    Remove-Item -Path ".\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ .next folder deleted" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No .next folder found" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Display browser cache clearing instructions
Write-Host "3️⃣ YOU MUST CLEAR BROWSER CACHE:" -ForegroundColor Red
Write-Host ""
Write-Host "   📋 COPY AND PASTE THIS INTO YOUR BROWSER'S ADDRESS BAR:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   chrome://settings/clearBrowserData" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "   Then:" -ForegroundColor Yellow
Write-Host "   • Select 'All time' as the time range" -ForegroundColor White
Write-Host "   • Check: ✅ Cookies and other site data" -ForegroundColor White
Write-Host "   • Check: ✅ Cached images and files" -ForegroundColor White
Write-Host "   • Click 'Clear data'" -ForegroundColor White
Write-Host ""
Write-Host "   OR use Developer Tools (F12):" -ForegroundColor Yellow
Write-Host "   • Press F12 in your browser" -ForegroundColor White
Write-Host "   • Go to Application tab" -ForegroundColor White
Write-Host "   • Click 'Storage' in left sidebar" -ForegroundColor White
Write-Host "   • Click 'Clear site data' button" -ForegroundColor White
Write-Host ""

# Step 4: Wait for user confirmation
Write-Host "4️⃣ Waiting for you to clear browser cache..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   ⏸️  Press ENTER after you have cleared your browser cache" -ForegroundColor Magenta
$null = Read-Host
Write-Host "   ✅ Continuing..." -ForegroundColor Green
Write-Host ""

# Step 5: Start dev server
Write-Host "5️⃣ Starting dev server with memory-only Firestore cache..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   🚀 Server starting at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ⚠️  IMPORTANT: After server starts:" -ForegroundColor Red
Write-Host "   • Close ALL browser tabs with localhost:3000" -ForegroundColor White
Write-Host "   • Open ONLY ONE new tab" -ForegroundColor White
Write-Host "   • Go to http://localhost:3000" -ForegroundColor White
Write-Host "   • Wait 2-3 minutes and watch console (F12)" -ForegroundColor White
Write-Host "   • You should see NO 'Quota exceeded' errors" -ForegroundColor White
Write-Host ""

npm run dev
