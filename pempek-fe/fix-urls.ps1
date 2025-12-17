# 1. Fix Products Page (line 51, 142, 143, 186, 222)
$file = "app\(admin)\(dashboard)\products\page.tsx"
$content = Get-Content -LiteralPath $file -Raw

# Replace semua variasi
$content = $content -replace "'http://localhost:5000/api/menu/all'", '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/menu/all`'
$content = $content -replace "`'http://localhost:5000/api/menu'", '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/menu`'
$content = $content -replace '`http://localhost:5000/api/menu/\$\{', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/menu/${'
$content = $content -replace '\? `http://localhost:5000/api/menu/\$\{', '? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/menu/${'

Set-Content -LiteralPath $file -Value $content -NoNewline
Write-Host "[OK] Fixed products page" -ForegroundColor Green

# 2. Fix Order Page (line 53)
$file = "app\(customer)\order\page.tsx"
$content = Get-Content -LiteralPath $file -Raw

$content = $content -replace '"http://localhost:5000/api/menu"', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/menu`'

Set-Content -LiteralPath $file -Value $content -NoNewline
Write-Host "[OK] Fixed order page" -ForegroundColor Green

# 3. Fix Sidebar (line 29)
$file = "app\components\admin\sidebar.tsx"
$content = Get-Content -LiteralPath $file -Raw

$content = $content -replace '"http://localhost:5000/api/admin/profile"', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/profile`'

Set-Content -LiteralPath $file -Value $content -NoNewline
Write-Host "[OK] Fixed sidebar" -ForegroundColor Green

Write-Host ""
Write-Host "Verification - checking for remaining localhost:5000..." -ForegroundColor Cyan
$remaining = Get-ChildItem -Path "app" -Recurse -Include "*.tsx","*.ts" | Select-String "localhost:5000" | Where-Object { $_.Line -notmatch "process\.env\.NEXT_PUBLIC_API_URL" }

if ($remaining) {
    Write-Host "[WARNING] Still found hardcoded localhost:" -ForegroundColor Yellow
    $remaining | Format-Table Path, LineNumber, Line -AutoSize
} else {
    Write-Host "[SUCCESS] All localhost:5000 references now use environment variable!" -ForegroundColor Green
}