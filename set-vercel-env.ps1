# This script adds environment variables to your Vercel project
# You need to provide your Vercel token

$vercelToken = Read-Host "Enter your Vercel API token (from https://vercel.com/account/tokens)"
$projectId = Read-Host "Enter your Vercel Project ID (find it in project settings)"
$teamId = Read-Host "Enter your Vercel Team ID (leave blank if personal)"

$headers = @{
    "Authorization" = "Bearer $vercelToken"
    "Content-Type" = "application/json"
}

$envVars = @(
    @{
        key = "NEXT_PUBLIC_API_URL"
        value = "http://localhost:8000/trpc"
        type = "plain"
        target = @("production", "preview", "development")
    },
    @{
        key = "JWT_SECRET"
        value = "4d55f765d77df4dd5d3d97fce130d54ac8a0f6d14195b435e5ef76346084307c61385376cf5d3d9be2362ec5889b6494e1bc8f7939cf878d2d82892216b238e1"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "WEB_URL"
        value = "https://from-builder.vercel.app"
        type = "plain"
        target = @("production", "preview", "development")
    }
)

foreach ($env in $envVars) {
    $url = "https://api.vercel.com/v9/projects/$projectId/env"
    if ($teamId) {
        $url += "?teamId=$teamId"
    }
    
    $body = $env | ConvertTo-Json
    
    Write-Host "Setting $($env.key)..."
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    Write-Host "Result: $($response.key) set successfully"
}

Write-Host "Environment variables set! Now redeploy your project on Vercel."
