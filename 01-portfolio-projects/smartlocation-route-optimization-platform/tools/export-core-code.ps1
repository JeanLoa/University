param(
  [string]$OutputPath = "codigo-completo-smartlocation.txt"
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDirectory "..")).Path

if (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
  $OutputPath = Join-Path $root $OutputPath
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
  New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
}

function Get-RelativePathFromRoot {
  param([string]$FullName)

  return $FullName.Substring($root.Length).TrimStart("\", "/")
}

$allowedRootFiles = @(
  ".dockerignore",
  ".editorconfig",
  ".prettierrc",
  "Dockerfile",
  "angular.json",
  "package.json",
  "tsconfig.app.json",
  "tsconfig.json",
  "tsconfig.spec.json"
)

$allowedExtensions = @(
  ".ts",
  ".html",
  ".css",
  ".py",
  ".json",
  ".mjs"
)

$excludedDirectoryFragments = @(
  "\.git\",
  "\node_modules\",
  "\dist\",
  "\.angular\",
  "\.idea\",
  "\.vscode\",
  "\__pycache__\"
)

$excludedPrefixes = @(
  "tools\",
  "Dataset\",
  "src\app\route-planning\domain\algorithms\",
  "src\app\route-planning\infrastructure\assemblers\",
  "src\app\route-planning\presentation\components\algorithm-comparison-panel\"
)

$excludedFiles = @(
  "package-lock.json",
  "public\favicon.ico",
  "src\app\app.spec.ts",
  "src\app\route-planning\application\use-cases\calculate-route.use-case.ts",
  "src\app\route-planning\application\use-cases\compare-algorithms.use-case.ts",
  "src\app\route-planning\domain\models\route-graph.model.ts",
  "src\app\route-planning\domain\repositories\route-graph.repository.ts",
  "src\app\route-planning\domain\services\route-cost.service.ts",
  "src\app\route-planning\domain\services\route-graph.service.ts",
  "src\app\route-planning\domain\services\route-metrics.service.ts",
  "src\app\route-planning\infrastructure\data-sources\lima-demo-graph.data-source.ts",
  "src\app\route-planning\infrastructure\data-sources\lima-route-graph.data-source.ts",
  "src\app\route-planning\infrastructure\repositories\static-route-graph.repository.ts",
  "src\app\route-planning\infrastructure\resources\lima-route-graph.resource.json",
  "src\app\route-planning\infrastructure\resources\route-graph.resource.ts",
  "src\app\route-planning\infrastructure\resources\map-layers\lima-boundaries.resource.json"
)

function Test-IsCoreSourceFile {
  param([System.IO.FileInfo]$File)

  $fullName = $File.FullName.Replace("/", "\")
  $relativePath = (Get-RelativePathFromRoot $File.FullName).Replace("/", "\")
  $extension = [System.IO.Path]::GetExtension($File.Name)

  foreach ($fragment in $excludedDirectoryFragments) {
    if ($fullName.Contains($fragment)) {
      return $false
    }
  }

  foreach ($prefix in $excludedPrefixes) {
    if ($relativePath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $false
    }
  }

  if ($excludedFiles -contains $relativePath) {
    return $false
  }

  if ($allowedRootFiles -contains $relativePath) {
    return $true
  }

  $isSourceFolder =
    $relativePath.StartsWith("src\", [System.StringComparison]::OrdinalIgnoreCase) -or
    $relativePath.StartsWith("python_engine\", [System.StringComparison]::OrdinalIgnoreCase)

  return $isSourceFolder -and ($allowedExtensions -contains $extension)
}

$includedFiles = Get-ChildItem -LiteralPath $root -Recurse -File -Force |
  Where-Object { Test-IsCoreSourceFile $_ } |
  Sort-Object FullName

$notableExcludedFiles = @(
  "package-lock.json - lock de dependencias, no codigo fuente",
  "dist/ - build generado",
  ".angular/ - cache local",
  "node_modules/ - dependencias instaladas",
  "python_engine/__pycache__/ - cache Python",
  "src/app/route-planning/infrastructure/resources/map-layers/lima-boundaries.resource.json - dataset pesado de contornos, documentado en Dataset",
  "src/app/route-planning/infrastructure/resources/lima-route-graph.resource.json - grafo legado reducido",
  "src/app/route-planning/domain/algorithms/ - algoritmos TypeScript legados reemplazados por motor Python"
)

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("SMARTLOCATION - CODIGO CORE EXPORTADO")
$lines.Add("Generado: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))")
$lines.Add("Raiz del proyecto: $root")
$lines.Add("")
$lines.Add("Criterio:")
$lines.Add("- Incluye codigo fuente Angular activo, motor Python y configuracion necesaria para compilar/desplegar.")
$lines.Add("- Excluye caches, builds, dependencias instaladas, archivos de IDE, lockfile, datasets pesados y codigo legado ignorado.")
$lines.Add("")
$lines.Add("Archivos incluidos ($($includedFiles.Count)):")

foreach ($file in $includedFiles) {
  $lines.Add("- $(Get-RelativePathFromRoot $file.FullName)")
}

$lines.Add("")
$lines.Add("Omisiones importantes:")
foreach ($excluded in $notableExcludedFiles) {
  $lines.Add("- $excluded")
}

$lines.Add("")
$lines.Add("============================================================")
$lines.Add("INICIO DEL CODIGO")
$lines.Add("============================================================")

foreach ($file in $includedFiles) {
  $relativePath = Get-RelativePathFromRoot $file.FullName
  $folder = Split-Path $relativePath -Parent
  if ([string]::IsNullOrWhiteSpace($folder)) {
    $folder = "."
  }

  $lines.Add("")
  $lines.Add("============================================================")
  $lines.Add("CARPETA: $folder")
  $lines.Add("ARCHIVO: $relativePath")
  $lines.Add("============================================================")
  $lines.Add("")
  $lines.Add((Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8))
}

Set-Content -LiteralPath $OutputPath -Value $lines -Encoding UTF8

Write-Host "Exportado: $OutputPath"
Write-Host "Archivos incluidos: $($includedFiles.Count)"
