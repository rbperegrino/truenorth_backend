rm -r ./client
cp -r ../truenorth_frontend/build ./client


docker build . --platform linux/amd64  --tag idemregistry.azurecr.io/truenorth --tag latest --target production

az acr login --name idemregistry -u idemregistry -p bX/YGzpCV+xvM6Ws0TFtsHYkOiAEcz+SLLsyQcgbZw+ACRAzC0VT

docker push idemregistry.azurecr.io/truenorth:latest
