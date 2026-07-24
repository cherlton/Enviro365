Get-ChildItem -Path 'C:\Users\Tumi\Documents\project-java\src' -Recurse -Filter '*.java' | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    $newContent = $content -replace 'com\.enviro\.assessment\.junior\.tumi', 'com.enviro.assessment.junior.cherlton'
    [System.IO.File]::WriteAllText($_.FullName, $newContent)
    Write-Host "Fixed: $($_.Name)"
}
Write-Host "All done!"
