const Sample2  = {
  data(){
    return {
      color:"red",
      url:"http://abehiroshi.la.coocan.jp/"
    }
  },
  template:`
  <div>
    <h1>v-bindとmethods</h1>
    <h2>v-bindについて</h2>
    <br><br>
    先程は変数をhtmlの中に埋め込んで表示することが出来ることを確認しました。<br>
    変数は下のようにhtmlタグの要素に結び付けて利用することが可能です。<br><br>
    変数urlは右のようになる{{ url }}<br>
    <a href="http://abehiroshi.la.coocan.jp/" id="abehiroshi">だれかのホームページ</a><br>

    <br><br>
    <h2>methodsについて</h2>
    <br><br>
    次にv-on:clickとmethodsを利用します。
    なんかエディタを覗けばわかる気がする、、、知らんけど、、。
    <div v-bind:style="{backgroundColor:color}">
      divのフィールド
      <br>
      <br>
      <button v-on:click="changeColor">フィールドの色を変える</button>
    </div>
    エディタから直接ファイルを閲覧してみると動作がわかります。
  </div>
  `
  ,
  methods:{
    changeColor: function() {
      if (this.color=="red"){
        this.color = "blue";
      }
      else{
        this.color = "red";
      }
    }
  }
};

export { Sample2 }
