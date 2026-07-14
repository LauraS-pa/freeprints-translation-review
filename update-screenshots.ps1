# Regenerates js/data.js from paired screenshots in the images/ folder.
#
# Simple workflow (preferred):
#   NN-screen-name-de.png   German / DE app screenshot
#   NN-screen-name-us.png   US / English app screenshot
#   Then double-click update-screenshots.bat
#
# Optional:
#   NN-screen-name.txt      Title + German reference lines
#   (If missing, the tab title comes from the file name and German text can be empty.)
#
# Legacy: a bare NN-screen-name.png (no -de/-us) is still treated as the German image.

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

function Format-TitleFromId([string]$id) {
  $parts = @($id -split "-")
  if ($parts.Count -gt 1 -and $parts[0] -match '^\d+$') {
    $parts = $parts[1..($parts.Count - 1)]
  }
  $words = foreach ($part in $parts) {
    if ([string]::IsNullOrEmpty($part)) { continue }
    $part.Substring(0, 1).ToUpper() + $part.Substring(1)
  }
  if ($words.Count -eq 0) { return $id }
  return ($words -join " ")
}

function Read-ScreenshotTxt([string]$path) {
  $lines = [System.IO.File]::ReadAllLines($path, [System.Text.UTF8Encoding]::new($false))
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
    $title = Format-TitleFromId ([IO.Path]::GetFileNameWithoutExtension($path))
  }

  return @{
    title = $title
    germanTexts = $germanTexts.ToArray()
  }
}

function Get-BaseId([string]$baseName) {
  if ($baseName -match '^(.*)-(de|us)$') {
    return $Matches[1]
  }
  return $baseName
}

$imageExtensions = @(".png", ".jpg", ".jpeg", ".webp")
$skipImageNames = @("placeholder", "placeholder-de", "placeholder-us")

# baseId -> @{ de = FileInfo|null; us = FileInfo|null }
$pages = New-Object 'System.Collections.Generic.SortedDictionary[string, object]'

function Ensure-Page([string]$id) {
  if (-not $pages.ContainsKey($id)) {
    $pages[$id] = @{ de = $null; us = $null }
  }
}

foreach ($file in Get-ChildItem -Path $imagesDir -File) {
  $ext = $file.Extension.ToLower()
  if ($imageExtensions -notcontains $ext) { continue }
  if ($file.Name -like "TEMPLATE*") { continue }
  if ($skipImageNames -contains $file.BaseName.ToLower()) { continue }

  $baseName = $file.BaseName
  if ($baseName -match '^(.*)-de$') {
    $id = $Matches[1]
    Ensure-Page $id
    $pages[$id].de = $file
  } elseif ($baseName -match '^(.*)-us$') {
    $id = $Matches[1]
    Ensure-Page $id
    $pages[$id].us = $file
  } else {
    # Legacy bare name = German image
    $id = $baseName
    Ensure-Page $id
    if ($null -eq $pages[$id].de) {
      $pages[$id].de = $file
    }
  }
}

foreach ($file in Get-ChildItem -Path $imagesDir -File -Filter "*.txt") {
  if ($file.Name -like "README*" -or $file.Name -like "TEMPLATE*") { continue }
  $id = Get-BaseId $file.BaseName
  Ensure-Page $id
}

$entries = New-Object System.Collections.Generic.List[object]

foreach ($id in $pages.Keys) {
  $pair = $pages[$id]
  $txtPath = Join-Path $imagesDir ($id + ".txt")

  if ($null -ne $pair.de) {
    $imageDe = "images/" + $pair.de.Name
  } else {
    $imageDe = "images/placeholder-de.svg"
    Write-Warning "No German image for $id - add images\$id-de.png (placeholder shown until then)."
  }

  if ($null -ne $pair.us) {
    $imageEn = "images/" + $pair.us.Name
  } else {
    $imageEn = "images/placeholder-us.svg"
    Write-Host "Note: No US image for $id yet - add images\$id-us.png when ready (placeholder shown until then)."
  }

  $entryTitle = Format-TitleFromId $id
  $entryGermanTexts = @()

  if (Test-Path -LiteralPath $txtPath) {
    $parsed = Read-ScreenshotTxt $txtPath
    $entryTitle = $parsed.title
    $entryGermanTexts = $parsed.germanTexts
  }

  $entries.Add([PSCustomObject]@{
    id = $id
    title = $entryTitle
    imageDe = $imageDe
    imageEn = $imageEn
    germanTexts = $entryGermanTexts
  })
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("/**")
[void]$sb.AppendLine(" * Screenshot review configuration (auto-generated).")
[void]$sb.AppendLine(" *")
[void]$sb.AppendLine(" * To add or change screenshots, put matching -de and -us images")
[void]$sb.AppendLine(" * in images/ and run: update-screenshots.bat")
[void]$sb.AppendLine(" * (or start the site with serve.ps1, which updates automatically).")
[void]$sb.AppendLine(" *")
[void]$sb.AppendLine(" * Pairing: NN-name-de.png + NN-name-us.png")
[void]$sb.AppendLine(" * Optional: NN-name.txt for title + German reference lines")
[void]$sb.AppendLine(" */")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("window.SCREENSHOTS = [")

for ($i = 0; $i -lt $entries.Count; $i++) {
  $entry = $entries[$i]
  [void]$sb.AppendLine("  {")
  [void]$sb.AppendLine(('    id: "{0}",' -f $entry.id))
  [void]$sb.AppendLine(('    title: "{0}",' -f (Escape-JsString $entry.title)))
  [void]$sb.AppendLine(('    imageEn: "{0}",' -f $entry.imageEn))
  [void]$sb.AppendLine(('    imageDe: "{0}",' -f $entry.imageDe))
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

Write-Host ("Updated js/data.js with {0} screenshot pair(s)." -f $entries.Count)
if ($entries.Count -eq 0) {
  Write-Host "Add paired images in images/ (example: 03-checkout-de.png + 03-checkout-us.png), then run again."
  Write-Host "A matching .txt description file is optional."
}
