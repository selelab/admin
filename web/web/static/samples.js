const SampleList  = {
  data(){
    return {

    }
  },
  template:`
  <div>
    <div>
        <h1>Sample List</h1>
        <router-link to="/samples/1">
            初めてのVue.js
        </router-link> <br>
        <router-link to="/samples/2">
            v-bindとmethod
        </router-link> <br>
    </div>

    &nbsp
    &nbsp
    &nbsp

    <div class="modal_wrap">
        <input id="trigger" type="checkbox">
        <div class="modal_overlay">
            <label for="trigger" class="modal_trigger">shit</label>
            <div class="modal_content">
                <label for="trigger" class="close_button">&#x2716;&#xfe0f;</label>
                <p>あなたがクリックしてしまったので<br>
                くまモンが隠れてしまいました<br>
                あ〜あ</p>
            </div>
        </div>
    </div>
    <label for="trigger" class="open_button">OPEN</label>
  </div>
  `
  ,
};

export { SampleList }
