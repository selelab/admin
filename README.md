# エレラボ管理画面API

## 環境構築

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