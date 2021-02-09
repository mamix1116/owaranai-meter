#!/bin/sh

cp ./dist/index.html ../app/templates/

rm -rf ../nginx/staticfiles/
mkdir -p ../nginx/staticfiles/

rm -rf ../nginx/mediafiles/
mkdir -p ../nginx/mediafiles/

cp -rf ./dist/* ../nginx/staticfiles/
cp -rf ../app/mediafiles/* ../nginx/mediafiles/
