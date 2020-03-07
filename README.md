up docker:
> docker-compose up -d

create migration:
> yarn sequelize migration:create --name=migration-name

create seeds:
> yarn sequelize seed:generate --name seed-name

run migrations:
> yarn sequelize db:migrate

undo migrations
> yarn sequelize db:migrate:undo:all

run seeds
> yarn sequelize db:seed:all

undo seeds
> yarn sequelize db:seed:undo:all
