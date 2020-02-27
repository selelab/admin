const Sample1  = {
  data(){
    return {
      message: "ねこ",
      //messageという変数の中に"ねこ"という文字列が入っている
      url: "http://abehiroshi.la.coocan.jp/"
    }
  },
  template:`
  <div>
    <h1>初めてのVue.js</h1>
    <h2>Hello!</h2>
    エディタから admin-api/web/web/static/sample/1.js を開いてみましょう。<br>
    またWindowsなら ctrl + Shift + i を、Macならば option + command + i を押してデバックツールを開きましょう。<br>

    書き込まれている内容が見えるはずです。<br><br>

    <!-- ちなみに先程から混ざっている<br>は改行を意味する記号です。気になるなら消してみてください -->

    以下に書き込まれているのはVue.jsの変数です。<br><br>
    {{ message }}
    <br><br>
    このように変数を {{}} で囲うことで変数の中身を表示することができます。<br>
    当然ですが変数には数値なども入れることができ、再代入も可能です。

  </div>
  `
  ,
};

export { Sample1 }
