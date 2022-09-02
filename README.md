<!--
## Настройка бейджей статуса тестов
Перед началом работы над проектом рекомендуется исправить бейджи, отражающие статус прохождения тестов.
Для этого замените разметку бейджей на следующий фрагмент, подставив вместо `${имя_пользователя}` и `${имя_репозитория}` соответствующие значения.

```
[![Tests for sprint 13](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml)

[![Tests for sprint 14](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml)
```
-->

<!-- Это бейдж теста по 13 спринту и уже не актуален
[![Tests](https://github.com/UserGitHub37/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/UserGitHub37/express-mesto-gha/actions/workflows/tests-13-sprint.yml)
-->

# Бэкенд для проекта "Место"

### Бэкенд проекта "Место" умеет проверять токены, создавать, регистрировать и авторизовывать пользователей, сохранять и отдавать карточки, запоминать, когда кто-то поставил лайк или передумал и убрал его. Перед добавлением в базу, данные проходят валидацию.

#### Бэкенд использует базу данных [MongoDB](https://www.mongodb.com/try/download/community)

### Этот проект доработан и объединен с фронтендом в fullstack-проекте react-mesto-api-full https://github.com/UserGitHub37/react-mesto-api-full

* * *

#### Технологии:
  JavaScript, Node.js, Express, Cookie, MongoDB, mongoose, dotenv, bcryptjs, jsonwebtoken.

* * *

#### При разработке бэкенда проект проходил предварительную проверку с помощью автотестов на базе Github Actions.
[![Tests](https://github.com/UserGitHub37/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/UserGitHub37/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

* * *

#### Директории

`/routes` — папка с файлами роутера<br/>
`/controllers` — папка с файлами контроллеров пользователя и карточки<br/>
`/models` — папка с файлами описания схем пользователя и карточки<br/>
`/errors` — папка с основными классами ошибок<br/>

* * *

#### Установка и запуск приложения на локальной машине:
(для работы приложения потребуется локально установленная база данных [MongoDB](https://www.mongodb.com/try/download/community) на дефолтном порту 27017)

1. Клонирование репозитория
```bash
git clone https://github.com/UserGitHub37/express-mesto-gha.git
```

2. Запуск сервера
`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload (запуск в режиме разработки, чтобы сервер перезапускался при изменении файлов проекта)

Бэкенд запустится и будет доступен по адресу http://localhost:3000
