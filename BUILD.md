owaranai-meter ビルド手順
----

### ローカルサイドで作業

GitHubからソース取得
```
$ git checkout master
$ git pull
```

git-secretで復号
```
$ gpg --list-keys
$ git secret whoknows
$ git secret list
$ git secret reveal
  => Enter passphrase:
```

frontend/.envを作成
```
$ cp frontend/.env.production frontend/.env
```

docker images delete
```
$ docker images
$ docker rmi <IMAGE ID>
```

docker images build with no-cache
```
$ docker-compose -f docker-compose.production.yaml build --no-cache
```

docker image をdocker hubにアップ
```
$ docker login
$ docker images
$ docker image tag <IMAGE ID> homata/owaranai-meter_nginx
$ docker image tag <IMAGE ID> homata/owaranai-meter_app
$ docker push homata/owaranai-meter_nginx
$ docker push homata/owaranai-meter_app
```

### 実行環境で作業

GitHubのソースを更新
```
$ cd owaranai-meter
$ git pull
```

docker-compose down
```
$ docker-compose -f docker-compose.production.run.yaml down
```

docker images delete
```
$ docker images
$ docker rmi <IMAGE ID>
```

docker image pull
```
$ docker login
$ docker pull homata/owaranai-meter_app
$ docker pull homata/owaranai-meter_nginx
```

docker-compose up
```
$ docker-compose -f docker-compose.production.run.yaml up -d
```

