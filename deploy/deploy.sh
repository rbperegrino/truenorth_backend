branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git rev-parse --short HEAD)


docker build . --platform=linux/amd64  --tag truenorth.azurecr.io/api/$branch:latest --tag truenorth.azurecr.io/api/$branch:$commit   --target production

az acr login --name truenorth

docker push -a truenorth.azurecr.io/api/$(echo $branch)


