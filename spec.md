FORMAT: 1A

# Data Structures

## UserInfo (object)
+ id : `users/152d7c4e-e4f6-45a7-befa-cbc9e0aacb1c` (string) - ID
+ name : test_user_1  (string) - 名前
+ email : test_user_1@example.com (string) - メールアドレス
+ last_modified : ` 2014-11-11T08:40:51.620Z` (string) - 最終更新日時
+ icon_media_key : `media/icons/29eb22b8-a953-4ec3-84b1-46b746e13071` (string) - プロフィール画像のキー

# ProjectType (enum, fixed) - プロジェクトの会計種別
## Members
+ soft - ソフトウェア会計
+ hard - ハードウェア会計

## ProjectInfo (object)
+ id : `projects/9e7710bf-e864-44f9-aa7f-fe5f589317ae` (string) - ID
+ title : エレラボAPI構築PJ (string) - タイトル
+ description : エレラボ管理画面のAPIを作る。 (string) - 説明
+ type (ProjectType) - 会計種別
+ leader (UserInfo) - 申請者
+ approver (UserInfo) - 承認者
+ passed_yen : 2000 (number) - 返金/配給済額
+ used_yen : 3000 (number) - 実支払い額
+ budget_est_yen : 8000 (number) - 予算概要額
+ budget_max_yen : 10000 (number) - 予算上限額
+ closed : false (boolean) - 完了したかどうか
+ approved : true (boolean) - 承認されたかどうか


# Group ユーザ管理

## 認証処理 [/sign_in]

### サインインする [POST]

+ user_email (string) - ユーザーの名前
+ password (string) - パスワード

+ Request (application/json)

        {
            "user_email": "test_user_1@example.com",
            "password": "hogehoge"
        }

+ Response 200 (application/json)

    + Attributes
        + user (UserInfo)

+ Response 400 (plain/text)

        Invalid Argument


### サインアウトする [DELETE]

+ Response 200 (plain/text)

        OK

+ Response 401 (plain/text)

        Unauthorized

## ユーザー全体の管理 [/users/]

### ユーザーの一覧を取得する [GET]

+ Response 200 (application/json)

    + Attributes
        + users (array[UserInfo], required, fixed-type) - ユーザー一覧

### 新しいユーザーを作成する [POST]

+ Request (application/json)

        {
            "user_name": "test_user_3",
            "user_email": "test_user_3@example.com",
            "password": "fugafuga"
        }

+ Response 200 (application/json)

    + Attributes
        + user (UserInfo)

## ユーザー単体の管理 [/users/{user_id}]

### ユーザーの情報を取得する [GET]

+ Parameters
  + user_id (string)

+ Response 200 (application/json)

    + Attributes
        + user_info (UserInfo)

+ Response 401 (plain/text)

        Unauthorized

### ユーザーの情報を更新する [PUT]

+ Parameters
  + user_id (string)

+ Request (application/json)

        {
            "password": "mogemoge",
            "icon_media_key": "user_icons/eb5f6ab6-1e94-4e47-8502-d3cb4f3ea74f"
        }

+ Response 200 (application/json)

    + Attributes
        + user_info (UserInfo)
            + icon_media_key : `user_icons/eb5f6ab6-1e94-4e47-8502-d3cb4f3ea74f`

+ Response 401 (plain/text)

        Unauthorized

### プロジェクトを削除する [DELETE]

+ Parameters
  + user_id (string)

+ Response 200 (plain/text)

        OK

# Group プロジェクト

## プロジェクト全体のコントロール [/projects]

### プロジェクトの一覧を取得する [GET]

+ Response 200 (application/json)

    + Attributes
        + projects (array[ProjectInfo], required, fixed-type) - プロジェクト一覧

### 新しいプロジェクトを作成する [POST]

+ Request

        [
            {
                "project_name": "test_project_1",
                "project_manager_id": "users/b688f1c0-5b6b-49fb-a7d4-52113fb1dd88",
                "description", "エレラボのAPIを作成する。",
                "budget": 10000,
                "completion_date": "2014-11-18"
            }
        ]

+ Response 200 (application/json)

    + Attributes
        + project (ProjectInfo)
