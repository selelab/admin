
<template>
  <div>
    <br />
    <v-card style="max-width: 480px; margin: auto;">
      <v-card-title primary-title>
        <h4>ログイン画面</h4>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-model="alert"
          :value="!!errorMessage"
          type="error"
          style="margin: auto; margin-bottom: 30px"
          outlined
          dismissible
        >{{ errorMessage }}</v-alert>

        <ValidationObserver ref="observer">
          <v-form class="login_form">
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
            <v-card-actions>
              <v-col></v-col>
              <v-col></v-col>
              <v-col></v-col>
              <v-col class="text-right">
                <v-btn
                  transition="scale-transition"
                  style="float: right; margin: 0"
                  width="100%"
                  class="mr-4"
                  align="right"
                  @click="login"
                  :disabled="connecting"
                >ログイン</v-btn>
              </v-col>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card-text>
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

import router from "@/router";
import api from "@/api";
import * as utils from "@/utils";

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
      password: "",
      errorMessage: "",
      alert: false,
      connecting: false
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  async created() {
    if (await this.$store.getters.hasLoggedIn) {
      router.push(this.$route.query.redirect || "/");
    }
  },
  methods: {
    login: async function() {
      this.connecting = true;
      try {
        const response = utils.camelize(await api.post("/v1/auth/", {
          email: this.email,
          password: this.password
        }));
        await this.$store.commit("setUserId", response.data.userId);
        await this.$store.dispatch("retrieveUserInfo");

        router.push(this.$route.query.redirect || "/");
      } catch (error) {
        this.errorMessage = utils.getErrorMessage(error.response);
        this.alert = true;
      }
      this.connecting = false;
    },
    clear() {
      this.email = "";
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
