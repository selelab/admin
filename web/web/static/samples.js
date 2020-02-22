const SampleList  = {
  data(){
    return {

    }
  },
  template:`
  <div>
     <h1>Sample List</h1>
     <router-link to="/samples/1">
       初めてのVue.js
     </router-link> <br>
     <router-link to="/samples/2">
       v-bindとmethod
     </router-link> <br>
  </div>

  <div class="modal_wrap">
<input id="trigger" type="checkbox">
	<div class="modal_overlay">
		<label for="trigger" class="modal_trigger"></label>
		<div class="modal_content">
			<label for="trigger" class="close_button">&#x2716;&#xfe0f;</label>
			<h2>Modal Content</h2>
			<p>Lorem ipsum ...</p>
		</div>
	</div>
</div>


  `
  ,
};

export { SampleList }
