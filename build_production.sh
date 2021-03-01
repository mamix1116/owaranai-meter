#!/bin/sh

docker-compose -f docker-compose.production.yaml down

docker rmi owaranai-meter_nginx
docker rmi owaranai-meter_app
docker rmi $(docker images -f "dangling=true" -q)

docker-compose -f docker-compose.production.yaml build --no-cache
docker-compose -f docker-compose.production.yaml up -d
