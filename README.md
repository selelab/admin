# エレラボ管理画面API

## 環境構築
### API系

- MySQLは事前にインストールしておいてください

- pipenvをインストールする
```bash
# Macの場合
brew install pipenv
# Windowsの場合
pip install pipenv
```

- 必要なモジュールをインストールする
```
pipenv install
```

- MySQLで `selelab-admin-api` というデータベースを作っておく
```SQL
create database `selelab-admin-api`
```

- `.env` ファイルを以下のように設定する
```env
DB_NAME='selelab-admin-api'
DB_USER='root'
DB_PSWD=''
DB_HOST=''
DB_PORT=''
```
ただし、パスワードはMySQLの設定による

- djangoの初期化
```bash
cd web
python manage.py migrate
python manage.py loaddata seed_auth seed_accounting
python manage.py createsuperuser
python manage.py runserver
```

### ドキュメント系

```
# nodejsをインストールする
brew install node

# aglioをインストールする
npm install -g aglio

# http://localhost:3000/ にAPIドキュメントをみるためのサーバーを起動する
aglio -i spec.md -s

# spec.htmlを出力する
#  -> https://htmlpreview.github.io/?https://github.com/selelab/admin-api/blob/master/docs/spec.html
aglio -i spec.md -o docs/spec.html
```