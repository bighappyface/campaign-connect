# names the network to be shared between docker containers
docker network create sam-local
# downloads and starts a container on host port 8000
docker run -d --name dynamodb-local --network sam-local -p 8000:8000 amazon/dynamodb-local
# Local API Server: http://127.0.0.1:3000/
sam local start-api --docker-network sam-local --env-vars env.json