#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Create a configuration file for the certificate
cat > ssl/localhost.conf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=US
ST=Local
L=Local
O=Development
OU=IT Department
CN=localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate private key
openssl genrsa -out ssl/localhost.key 2048

# Generate certificate signing request and certificate in one step
openssl req -new -x509 -key ssl/localhost.key -out ssl/localhost.crt -days 365 -config ssl/localhost.conf -extensions v3_req

# Set proper permissions
chmod 600 ssl/localhost.key
chmod 644 ssl/localhost.crt

echo "Enhanced SSL certificates generated successfully!"
echo "Certificate: ssl/localhost.crt"
echo "Private Key: ssl/localhost.key"
echo ""
echo "To trust this certificate in Chrome/Edge (Linux):"
echo "1. Go to chrome://settings/certificates"
echo "2. Click 'Authorities' tab"
echo "3. Click 'Import' and select ssl/localhost.crt"
echo "4. Check 'Trust this certificate for identifying websites'"
echo ""
echo "Alternative: Add to system trust store:"
echo "sudo cp ssl/localhost.crt /usr/local/share/ca-certificates/localhost.crt"
echo "sudo update-ca-certificates"