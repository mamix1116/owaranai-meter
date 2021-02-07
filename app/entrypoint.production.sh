#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# ex. Here is a list of commands you want to run after PostgreSQL is started.
# python manage.py flush --no-input
# python manage.py migrate
# python manage.py init_data

exec "$@"
