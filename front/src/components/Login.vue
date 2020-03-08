
<template>
  <div>
    <v-card style="width: 80%; max-width: 480px; margin: auto" height="260px">
      <v-card-title primary-title>
        <h4>ログインしてください</h4>
      </v-card-title>
      <ValidationObserver ref="observer">
        <form class="login_form">
          <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
            <v-text-field v-model="email" :error-messages="errors" label="E-mail" required></v-text-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="password" rules="required">
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              :error-messages="errors"
              required
            ></v-text-field>
          </ValidationProvider>

          <v-btn style="float: right" class="mr-4" @click="login">ログイン</v-btn>
        </form>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
import { required, email, max } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";

import router from "../router";
import api from "../api";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

extend("email", {
  ...email,
  message: "Email must be valid"
});
const Login = {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    login: function() {
      api
        .post("/jwt-token/", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.$store.commit("setJwtToken", response.data.token);
          router.push(this.$route.query.redirect || "/");
        })
        .catch(error => {
          console.log(error);
        });
    },
    clear() {
      this.email = "";
      this.select = null;
      this.checkbox = null;
      this.$refs.observer.reset();
    }
  }
};
export default Login;
</script>

<style scoped>
.login_form {
  width: 80%;
  margin: auto;
}
</style>