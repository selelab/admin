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
  `
  ,
};

export { SampleList }
