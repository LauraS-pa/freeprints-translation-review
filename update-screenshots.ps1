# Regenerates js/data.js from images in the images/ folder.
# Pair each screenshot image with a matching .txt file (same name, .txt extension).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$imagesDir = Join-Path $root "images"
$dataFile = Join-Path $root "js\data.js"

function Escape-JsString([string]$value) {
  if ([string]::IsNullOrEmpty($value)) { return "" }
  $value = $value.Replace("\", "\\")
  $value = $value.Replace('"', '\"')
  $value = $value.Replace("`r`n", "\n")
  $value = $value.Replace("`n", "\n")
  $value = $value.Replace("`r", "\n")
  return $value
}

function Read-ScreenshotTxt([string]$path) {
  $lines = Get-Content -Path $path -Encoding UTF8
  $title = ""
  $germanTexts = New-Object System.Collections.Generic.List[object]
  $titleSet = $false

  foreach ($line in $lines) {
    $trimmed = $line.Trim()
    if (-not $titleSet) {
      if ($trimmed.Length -eq 0) { continue }
      $title = $trimmed
      $titleSet = $true
      continue
    }
    if ($trimmed.Length -eq 0) { continue }
    if ($trimmed.StartsWith("#")) { continue }

    $colon = $trimmed.IndexOf(":")
    if ($colon -gt 0) {
      $label = $trimmed.Substring(0, $colon).Trim()
      $german = $trimmed.Substring($colon + 1).Trim()
      if ($label.Length -gt 0 -and $german.Length -gt 0) {
        $germanTexts.Add([PSCustomObject]@{ label = $label; german = $german })
      }
    } else {
      $germanTexts.Add([PSCustomObject]@{ label = "Text"; german = $trimmed })
    }
  }

  if (-not $titleSet) {
    $title = [IO.Path]::GetFileNameWithoutExtension($path)
  }

  return @{
    title = $title
    germanTexts = $germanTexts.ToArray()
  }
}

$imageExtensions = @(".png", ".jpg", ".jpeg", ".webp")
$ids = New-Object 'System.Collections.Generic.SortedDictionary[string, object]'

foreach ($file in Get-ChildItem -Path $imagesDir -File) {
  if ($imageExtensions -contains $file.Extension.ToLower() -and $file.Name -notlike "TEMPLATE*") {
    $ids[$file.BaseName] = $file
  }
}

foreach ($file in Get-ChildItem -Path $imagesDir -File -Filter "*.txt") {
  if ($file.Name -like "README*" -or $file.Name -like "TEMPLATE*") { continue }
  if (-not $ids.ContainsKey($file.BaseName)) {
    $ids[$file.BaseName] = $null
  }
}

$entries = New-Object System.Collections.Generic.List[object]

foreach ($id in $ids.Keys) {
  $imageFile = $ids[$id]
  $txtPath = Join-Path $imagesDir ($id + ".txt")

  if ($null -ne $imageFile) {
    $imagePath = "images/" + $imageFile.Name
  } else {
    $imagePath = "images/" + $id + ".png"
    Write-Warning "No image for $id - add images\$id.png (a placeholder will show until then)."
  }

  $entryTitle = ($id -replace "-", " ")
  $entryGermanTexts = @()

  if (Test-Path -LiteralPath $txtPath) {
    $parsed = Read-ScreenshotTxt $txtPath
    $entryTitle = $parsed.title
    $entryGermanTexts = $parsed.germanTexts
  } else {
    Write-Warning "No description file for $id - add images\$id.txt (copy images\TEMPLATE-new-screenshot.txt)."
  }

  $entries.Add([PSCustomObject]@{
    id = $id
    title = $entryTitle
    image = $imagePath
    germanTexts = $entryGermanTexts
  })
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("/**")
[void]$sb.AppendLine(" * Screenshot review configuration (auto-generated).")
[void]$sb.AppendLine(" *")
[void]$sb.AppendLine(" * To add or change screenshots, edit files in images/ and run:")
[void]$sb.AppendLine(" *   update-screenshots.bat")
[void]$sb.AppendLine(" * or start the site with serve.ps1 (updates automatically).")
[void]$sb.AppendLine(" */")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("window.SCREENSHOTS = [")

for ($i = 0; $i -lt $entries.Count; $i++) {
  $entry = $entries[$i]
  [void]$sb.AppendLine("  {")
  [void]$sb.AppendLine(('    id: "{0}",' -f $entry.id))
  [void]$sb.AppendLine(('    title: "{0}",' -f (Escape-JsString $entry.title)))
  [void]$sb.AppendLine(('    image: "{0}",' -f $entry.image))
  [void]$sb.AppendLine('    originalEnglish: "",')
  [void]$sb.AppendLine("    germanTexts: [")

  foreach ($text in $entry.germanTexts) {
    [void]$sb.AppendLine(('      {{ label: "{0}", german: "{1}" }},' -f (Escape-JsString $text.label), (Escape-JsString $text.german)))
  }

  [void]$sb.AppendLine("    ],")
  if ($i -lt $entries.Count - 1) {
    [void]$sb.AppendLine("  },")
  } else {
    [void]$sb.AppendLine("  }")
  }
}

[void]$sb.AppendLine("];")
[void]$sb.AppendLine("")

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[IO.File]::WriteAllText($dataFile, $sb.ToString(), $utf8NoBom)

Write-Host ("Updated js/data.js with {0} screenshot(s)." -f $entries.Count)
if ($entries.Count -eq 0) {
  Write-Host "Add a PNG or JPG to images/ plus a matching .txt file, then run this script again."
}
