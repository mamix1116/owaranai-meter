# 発言が終わらないメーター

“女性が多い会議”は本当に“時間がかかる”のか？

[LT スライド 2021.02.13.](https://speakerdeck.com/mamix1116/owaranai)

## プロジェクトについて

会議中の発言時間を計測・可視化します。

- 計測された情報はどうなりますか？
    - あなたが入力および計測した会議の人数と時間の情報はサーバーに収集され、全体の集計へ反映されます。ただし、会議名は収集していません。

- このプロジェクトの背景は？
    - 2021年2月3日、本オリンピック委員会（JOC）臨時評議員会で、名誉委員である森喜朗氏が、「女性がたくさん入っている理事会の会議は時間がかかる」「女性を増やす場合は発言の時間もある程度は規制しておかないと、なかなか終わらないので困る」などと発言しました。この女性軽視と受け取れる発言を発端に、何かしらのアクションを形にしようと、有志によりスタートしました。

## ライセンスについて
MITライセンスです。


## 開発について
### 手伝ってくださる方へ
ジェンダーにまつわる課題に関心を持つ有志によるプロジェクトです。コントリビューターを募集しております。


## 開発環境

* Django + Python3
* PostgreSQL
* Vue.js

## docker-compose

```sh
docker-compose -f docker-compose.development.yml build --no-cache
docker-compose -f docker-compose.development.yml up -d
docker-compose -f docker-compose.development.yml run app python manage.py flush --no-input
docker-compose -f docker-compose.development.yml run app python manage.py migrate
```

entry point: http://localhost:1337

## python3 + venv

VSCodeの保管を有効にするためにlocalにvenvを立てる

```sh
cd app
python3 -m venv venv
source venv/bin/activate
pip install pipenv
pipenv install --dev --system
code .
```

## docker-compose + local development server

- prerequisites: python3 + venv

```sh
docker-compose -f docker-compose.development.yml -f docker-compose.development.local.yml up -d --build
source app/venv/bin/activate
set -a; source ./.env.development; source ./.env.development.local; set +a
python app/manage.py runserver
```

- prerequisites: devserver of Vue.js

```sh
cd frontend
yarn install
dev-serve
```

entry point: http://localhost:8888/

## docker-compose + local.development + windows

Django
```sh
docker-compose -f docker-compose.development.yml -f docker-compose.development.local.yml up -d db
cd app
pip install pipenv
set PIPENV_VENV_IN_PROJECT=1 (export PIPENV_VENV_IN_PROJECT=1 for linux )
pipenv shell
pipenv install --dev
python -V
pip freeze
python manage.py migrate
python manage.py runserver 0.0.0.0:8000 
```

Vue.js
```sh
cd frontend
yarn install
dev-serve
```

entry point: http://localhost:8888/ -> (API)http://localhost:8000/


## 本番環境構築

### docker-compose

通常の場合：Dockerイメージをビルドして更新する
```sh
docker-compose -f docker-compose.production.yaml down
docker-compose -f docker-compose.production.yaml build
docker-compose -f docker-compose.production.yaml up -d
```

キャッシュ無しでビルドする場合
```sh
docker-compose -f docker-compose.production.yaml build --no-cache
```

データベースの初期化
```sh
docker-compose -f docker-compose.production.yaml run app python manage.py flush --no-input
```

Djangoのモデルを更新した場合はデータベースを更新する
```sh
docker-compose -f docker-compose.production.yaml run app python manage.py migrate
```
