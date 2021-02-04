# 発言が終わらないメーター

“女性の多い会議は時間がかかる”のか


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
