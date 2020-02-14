# エレラボ管理画面API

## 環境構築
### API系

- Python(>=3.7), MySQLは事前にインストールしておいてください
    - Windowsの場合
        - Python: https://www.python.org/downloads/
        - MySQL: https://dev.mysql.com/downloads/installer/
    - MacOSの場合
        - Pythonのインストール
            ```bash
            brew install pyenv
            pyenv install 3.8.0
            echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
            echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
            echo 'eval "$(pyenv init -)"' >> ~/.bashrc

        - MySQLのインストール
            ```bash
            brew install mysql
            brew services start mysql
            ```

- pipenvをインストールする(初回のみ)
    ```bash
    # Macの場合
    brew install pipenv
    # Windowsの場合
    pip install pipenv
    ```

- 必要なモジュールをインストールする(初回のみ)
    ```
    pipenv install
    ```

- MySQLで `selelab-admin-api` というデータベースを作っておく(初回のみ)
    ```bash
    $ mysql -u root
    Welcome to the MySQL monitor.  Commands end with ; or \g.

    ... (中略) ...

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    mysql> create database `selelab-admin-api`
    ```

- `.env` ファイルを以下のように設定する(初回のみ)

    ```env
    DB_NAME='selelab-admin-api'
    DB_USER='root'
    DB_PASS=''
    DB_HOST=''
    DB_PORT=''
    ```

ただし、パスワードはMySQLの設定による

- djangoの初期化(初回のみ)

    ```bash
    pipenv shell  # VSCodeの機能でpipenvが自動的に起動される場合は不要
    cd web  # admin-api/webに移動する
    python manage.py migrate
    python manage.py loaddata seed_auth seed_accounting
    python manage.py createsuperuser
    ```

    - サーバーの起動
    ```bash
    cd web  # admin-api/webに移動する
    python manage.py runserver
    ```

- エンドポイントにアクセス
    - ユーザーの一覧を取得する
    http://localhost:8000/v1/api/users/
    ```json
    [
        {
            "id": "380ac58d-1595-4614-a8e2-5e881b51d18a",
            "name": "user1",
            "email": "user1@example.com",
            "last_modified": "2020-02-08T01:41:57.829000Z",
            "icon_media_key": "8284e730-8e31-47b6-b4ab-f230e12ee089",
            "date_registered": "2020-02-08T03:02:10.908000Z"
        },
        {
            "id": "f2b34d83-b890-45ff-aedd-1d11a92cb9f5",
            "name": "user2__",
            "email": "user2@example.com",
            "last_modified": "2020-02-08T03:00:46.763000Z",
            "icon_media_key": "8284e730-8e31-47b6-b4ab-f230e12ee089",
            "date_registered": "2020-02-08T03:02:10.908000Z"
        }
    ]
    ```
    - プロジェクトの一覧を取得する
    http://localhost:8000/v1/api/projects/
    ```json
    [
        {
            "id": "1982e609-9c92-40ab-ac85-ee7f2830ab2a",
            "title": "すごいプロジェクト",
            "accounting_type": "soft",
            "leader": "380ac58d-1595-4614-a8e2-5e881b51d18a",
            "closed": false
        },
        {
            "id": "5cfec77f-c466-415b-a7de-8be6b43bbc6d",
            "title": "DjangoでREST API作るぞ",
            "accounting_type": "soft",
            "leader": "f2b34d83-b890-45ff-aedd-1d11a92cb9f5",
            "closed": false
        },
        {
            "id": "66c1b2b1-7376-48c1-9509-e52d568ed910",
            "title": "ホゲホゲプロジェクト",
            "accounting_type": "soft",
            "leader": null,
            "closed": false
        },
        {
            "id": "da96e698-3dae-47b5-ae64-b6f5a7650387",
            "title": "ホゲホゲプロジェクト",
            "accounting_type": "soft",
            "leader": "380ac58d-1595-4614-a8e2-5e881b51d18a",
            "closed": false
        }
    ]
    ```
    - 購入の一覧を取得する
    http://localhost:8000/v1/api/purchases/
    ```json
    [
        {
            "id": "690c4aeb-fef7-45d2-a98b-1c5f8c7af548",
            "title": "交通費",
            "description": "東京駅から草津温泉までの交通費です。",
            "project_id": "1982e609-9c92-40ab-ac85-ee7f2830ab2a",
            "evidence_media_key": "d2a85f4f-4ac5-4dcb-986e-6e988d83d3b4",
            "price": 5670,
            "returned": false,
            "approved": false
        },
        {
            "id": "768a00ae-b643-4449-8148-418e996636c7",
            "title": "交際費",
            "description": "軽井沢ビール購入代金",
            "project_id": "1982e609-9c92-40ab-ac85-ee7f2830ab2a",
            "evidence_media_key": "d2a85f4f-4ac5-4dcb-986e-6e988d83d3b4",
            "price": 1862,
            "returned": false,
            "approved": false
        }
    ]
    ```

### ドキュメント系

- 初期設定

    ```
    # nodejsをインストールする
    brew install node

    # aglioをインストールする
    npm install -g aglio
    ```

- http://localhost:3000/ でAPIドキュメントをみるためのサーバーを起動する
    ```
    aglio -i spec.md -s
    ```

- spec.htmlを出力する

    GitHub上にアップロードした後、https://htmlpreview.github.io/?https://github.com/selelab/admin-api/blob/master/docs/spec.html で見ることができる。
    ```
    aglio -i spec.md -o docs/spec.html
    ```
