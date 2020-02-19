import * as api from './api.js'

const UserList = {
  data() {
    return {
      user_lists: [],
    }
  },
  template: `
  <div>
    <h1>UserList</h1>
    <ul>
        <li v-for="user in user_lists">
              名前: {{ user.display_name }}<br>
              メアド: {{ user.email }}
        </li>
    </ul>
  </div>
  `,
  created() {
    api.get('/v1/api/users/')
      .then(response => {
        this.user_lists = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export { UserList };