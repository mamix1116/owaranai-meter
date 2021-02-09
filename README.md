# 発言が終わらないメーター

“女性が多い会議”は本当に“時間がかかる”のか？

## プロジェクトについて

会議中の発言時間を計測・可視化します。

- 計測された情報はどうなりますか？
    - あなたが入力および計測した会議の人数と時間の情報はサーバーに収集され、全体の集計へ反映されます。ただし、会議名は収集していません。

- このプロジェクトの背景は？
    - 2021年2月3日、本オリンピック委員会（JOC）臨時評議員会で、名誉委員である森喜朗氏が、「女性がたくさん入っている理事会の会議は時間がかかる」「女性を増やす場合は発言の時間もある程度は規制しておかないと、なかなか終わらないので困る」などと発言しました。この女性軽視と受け取れる発言を発端に、何かしらのアクションを形にしようと、有志によりスタートしました。

## 開発について
### 手伝ってくださる方へ
ジェンダーにまつわる課題に関心を持つ有志によるプロジェクトです。コントリビューターを募集しております。


# 開発環境

## docker-compose

```sh
docker-compose -f docker-compose.development.yml
docker-compose -f docker-compose.development.yml run app python manage.py flush --no-input
docker-compose -f docker-compose.development.yml run app python manage.py migrate
docker-compose -f docker-compose.development.yml run app python manage.py init_data
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
docker-compose -f docker-compose.development.yml -f docker-compose.development.local.yml up -d
source app/venv/bin/activate
set -a; source ./.env.development; source ./.env.development.local; set +a
python app/manage.py runserver
```

entry point: http://localhost:8000
