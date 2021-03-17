<template>
  <v-app>
    <v-app-bar dense dark fixed flat>
      <v-spacer />
      <v-toolbar-title>
        <span :class="$vuetify.breakpoint.smAndDown ? 'subtitle-1' : 'headline'">Hackathon Global Inc.&#8482; Event Schedule </span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        small
        outlined
        color="white"
        class="ml-3"
        to="./"
        nuxt
      >
        Back
      </v-btn>
    </v-app-bar>
    <v-container fill-height fluid class="white">
      <v-row
        align="center"
        justify="center"
        class="py-16"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="mt-4 mb-6">
            <v-card-title>
              Login
            </v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  v-model="form.username"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  color="orange"
                  type="text"
                  :rules="[v => !!v || 'Username is required']"
                  aria-required=""
                  required
                  :error-messages="errorMess"
                />

                <v-text-field
                  id="password"
                  v-model="form.password"
                  label="Password"
                  name="password"
                  color="orange"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[v => !!v || 'Password is required']"
                  required
                  :error-messages="errorMess"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" @click="onLogin">
                Log In
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      // Hardcoded Valid Authorization
      adminUsername: 'hacker@hglobalinc',
      adminPass: '1234abcd',

      // Error Message for Form Validation
      errorMess: '',
      // Form submitted for validation when onLogin() called
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onLogin () { // On Login Click, validate form for correct username & password.
      if (this.$refs.form.validate()) {
        if (this.form.username === this.adminUsername && this.form.password === this.adminPass) {
          this.$store.commit('auth/setloggedIn', true)
          this.$router.push('./')
        } else {
          this.errorMess = 'Incorrect username or password.'
          setTimeout(() => { this.errorMess = '' }, 5000)
        }
      }
    }
  }
}
</script>
