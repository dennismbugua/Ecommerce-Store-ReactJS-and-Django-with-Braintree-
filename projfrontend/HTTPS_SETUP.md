# HTTPS Setup for React Development

This guide explains how to run your React application with HTTPS locally using self-signed SSL certificates.

## Quick Start

### Option 1: Using Environment Variables (Simplest)
The React app is already configured to use HTTPS through the `.env` file. Simply run:

```bash
npm start
```

The app will automatically start with HTTPS at `https://localhost:3000`

### Option 2: Using Custom SSL Certificates

If you want to use custom SSL certificates or regenerate them:

#### On Linux/macOS:
```bash
./generate-ssl.sh
npm run start:https
```

#### On Windows (PowerShell):
```powershell
.\generate-ssl.ps1
npm run start:https
```

## Configuration Files

### `.env` Configuration
```
REACT_APP_BACKEND=http://127.0.0.1:8000/api/
HTTPS=true
SSL_CRT_FILE=ssl/localhost.crt
SSL_KEY_FILE=ssl/localhost.key
GENERATE_SOURCEMAP=false
```

### Package.json Scripts
- `npm start` - Start with HTTPS (using .env configuration)
- `npm run start:https` - Start with HTTPS (explicit SSL files)
- `npm run generate-ssl` - Generate new SSL certificates (Linux/macOS only)

## SSL Certificate Details

The generated certificates include:
- **Certificate**: `ssl/localhost.crt` (valid for 365 days)
- **Private Key**: `ssl/localhost.key`
- **Subject Alternative Names**: 
  - `localhost`
  - `127.0.0.1`
  - `::1` (IPv6 localhost)

## Browser Security Warnings

Since these are self-signed certificates, your browser will show a security warning. This is normal for development:

### Chrome/Edge:
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

### Firefox:
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

### Safari:
1. Click "Show Details"
2. Click "visit this website"
3. Click "Visit Website" in the popup

## Trusting the Certificate (Optional)

To avoid browser warnings, you can add the certificate to your system's trusted root certificates:

### macOS:
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ssl/localhost.crt
```

### Linux (Ubuntu/Debian):
```bash
sudo cp ssl/localhost.crt /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
```

### Windows:
1. Double-click `ssl/localhost.crt`
2. Click "Install Certificate"
3. Choose "Local Machine"
4. Select "Place all certificates in the following store"
5. Click "Browse" and select "Trusted Root Certification Authorities"
6. Click "Next" and "Finish"

## Troubleshooting

### Common Issues:

1. **"Certificate not trusted" errors**:
   - This is normal with self-signed certificates
   - Follow the browser-specific steps above to proceed

2. **"SSL_CRT_FILE not found" errors**:
   - Run `./generate-ssl.sh` or `.\generate-ssl.ps1` to generate certificates
   - Make sure the `ssl/` directory exists

3. **OpenSSL not found (Windows)**:
   - Install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html
   - Add OpenSSL to your system PATH

4. **Port 443 already in use**:
   - React dev server uses port 3000 by default, not 443
   - If you need to use port 443, run as administrator/root

## Production Considerations

⚠️ **Important**: These self-signed certificates are for development only!

For production:
- Use certificates from a trusted Certificate Authority (CA)
- Consider services like Let's Encrypt for free SSL certificates
- Use proper SSL termination with nginx, Apache, or a CDN

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `HTTPS` | Enable HTTPS | `true` |
| `SSL_CRT_FILE` | Path to SSL certificate | `ssl/localhost.crt` |
| `SSL_KEY_FILE` | Path to SSL private key | `ssl/localhost.key` |
| `PORT` | Development server port | `3000` |
| `HOST` | Development server host | `localhost` |

## Security Notes

- SSL certificates are generated with 2048-bit RSA keys
- Certificates are valid for 365 days from generation
- Private keys are not password-protected (suitable for development only)
- Certificates include Subject Alternative Names for localhost and IP addresses