# Push main to origin, then sync main -> master and push master (for Vercel deploy)
# Run in PowerShell from project folder: .\push-to-master.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Remove stale lock so commit/push can run
$lockPath = Join-Path .git "index.lock"
if (Test-Path $lockPath) {
    Remove-Item -Force $lockPath -ErrorAction SilentlyContinue
}

$branch = git branch --show-current
Write-Host "Current branch: $branch"

# 1. Push main (commit first if there are changes)
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m "Update: hero and layout changes"
}
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git push origin main failed. Check remote and credentials."
    exit 1
}
Write-Host "Pushed main OK."

# 2. Update master from main and push master
git checkout master
git pull origin master
git merge main -m "Merge main into master"
git push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git push origin master failed."
    git checkout main
    exit 1
}
Write-Host "Pushed master OK."

git checkout main
Write-Host "Done. Back on main."
