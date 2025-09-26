# PowerShell script to generate SSL certificates for local development

# Create SSL directory if it doesn't exist
if (!(Test-Path -Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl"
}

# Check if OpenSSL is available
try {
    $null = Get-Command openssl -ErrorAction Stop
} catch {
    Write-Error "OpenSSL is not installed or not in PATH. Please install OpenSSL first."
    Write-Host "You can download OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html"
    exit 1
}

# Generate private key
Write-Host "Generating private key..."
& openssl genrsa -out ssl/localhost.key 2048

# Create configuration file for certificate
$config = @"
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C=US
ST=Local
L=Local
O=Development
CN=localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1
"@

$config | Out-File -FilePath "ssl/localhost.conf" -Encoding ASCII

# Generate certificate signing request
Write-Host "Generating certificate signing request..."
& openssl req -new -key ssl/localhost.key -out ssl/localhost.csr -config ssl/localhost.conf

# Generate self-signed certificate
Write-Host "Generating self-signed certificate..."
& openssl x509 -req -in ssl/localhost.csr -signkey ssl/localhost.key -out ssl/localhost.crt -days 365 -extensions v3_req -extfile ssl/localhost.conf

# Clean up temporary files
Remove-Item ssl/localhost.csr
Remove-Item ssl/localhost.conf

Write-Host "SSL certificates generated successfully!" -ForegroundColor Green
Write-Host "Certificate: ssl/localhost.crt" -ForegroundColor Yellow
Write-Host "Private Key: ssl/localhost.key" -ForegroundColor Yellow
Write-Host ""
Write-Host "To use HTTPS in your React app, run: npm run start:https" -ForegroundColor Cyan