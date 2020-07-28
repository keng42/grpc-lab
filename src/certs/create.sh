# https://github.com/grpc/grpc/issues/6757

openssl genrsa -passout pass:Vd9ZeDMFaNW7QOya -des3 -out ca.key 4096

openssl req -passin pass:Vd9ZeDMFaNW7QOya -new -x509 -days 365 -key ca.key -out ca.crt -subj  "/C=CN/ST=Guangdong/L=Guangzhou/O=KC/OU=Dev/CN=ca"

openssl genrsa -passout pass:Vd9ZeDMFaNW7QOya -des3 -out server.key 4096

openssl req -passin pass:Vd9ZeDMFaNW7QOya -new -key server.key -out server.csr -subj  "/C=CN/ST=Guangdong/L=Guangzhou/O=KC/OU=Server/CN=localhost"

openssl x509 -req -passin pass:Vd9ZeDMFaNW7QOya -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt

openssl rsa -passin pass:Vd9ZeDMFaNW7QOya -in server.key -out server.key

openssl genrsa -passout pass:Vd9ZeDMFaNW7QOya -des3 -out client.key 4096

openssl req -passin pass:Vd9ZeDMFaNW7QOya -new -key client.key -out client.csr -subj  "/C=CN/ST=Guangdong/L=Guangzhou/O=KC/OU=Client/CN=localhost"

openssl x509 -passin pass:Vd9ZeDMFaNW7QOya -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt

openssl rsa -passin pass:Vd9ZeDMFaNW7QOya -in client.key -out client.key
