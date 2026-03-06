# Sync main into master and push (for Vercel deploy from master)
# Run this in PowerShell from the project folder after opening Terminal in Cursor/VS Code.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Current branch:" (git branch --show-current)
git checkout master
git pull origin master
git merge main -m "Merge main: header sticky, transparent, language toggle, hero under nav"
git push origin master
Write-Host "Done. Switched back to main."
git checkout main
