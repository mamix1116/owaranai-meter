#!/bin/sh

cp ./dist/index.html ../app/templates/
cp ./dist/favicon.ico ../app/templates/

cp -rf ./dist/css/ ../app/staticfiles/
cp -rf ./dist/js/ ../app/staticfiles/
cp -rf ./dist/img/  ../app/staticfiles/
