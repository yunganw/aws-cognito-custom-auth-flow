<template>
  <div class="container">
    <div class="modal-dialog">
      <center>
        <b-toast id="info-toast" title="info" static solid variant="success">
          {{toastmsg}}
        </b-toast>
      </center>
      <div class="modal-content background-customizable modal-content-mobile">
        <div>
          <div class="banner-customizable">
            <center></center>
          </div>
        </div>
        <div class="modal-body">
          <h2>Magic Login</h2>
          <br />
          <span
            >Enter your Email address below, <br />
            we will send you a magic link to login.</span
          >
          <form @submit.prevent="login">
            <br />
            <input
              name="email"
              id="email"
              class="form-control inputField-customizable"
              placeholder="Email address..."
              autocapitalize="none"
              required
              aria-label="email"
              value=""
              type="email"
              v-model="email"
            />
            <br />
            <b-button variant="success" v-if="loading">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Sending...
            </b-button>
            <b-button v-else name="confirm" type="submit" variant="success">
              Confirm
            </b-button>
            <a class="redirect-customizable" href="/"> Return to login</a>
          </form>
        </div>
        <!-- <div>
                    <p class="redirect-customizable"><span>Need an account?</span>&nbsp;<a
                                    href="/register">Sign up</a></p>
                </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import * as axios from "axios";
import awsconfig from "../aws-exports";
const MAGICLINKURL = awsconfig.magiclink_url;

export default {
  name: "Login",
  data() {
    return {
      toastmsg: "",
      email: "",
      loading: false,
    };
  },
  methods: {
    toast(msg) {
      this.$bvToast.toast(msg, {
        title: "info.",
        toaster: "b-toaster-top-center",
        solid: true,
        static: true,
        appendToast: true,
        // noAutoHide: true,
        variant: "success",
      });
    },
    async login() {
      this.loading = true;
      Auth.configure({
        authenticationFlowType: "CUSTOM_AUTH",
      });

      Auth.signIn(this.email)
        .then((user) => {
          if (user.challengeName === "CUSTOM_CHALLENGE") {
            axios
              .post(MAGICLINKURL, {
                username: user.username,
                email: this.email,
                session: user.Session,
              })
              .then((response) => {
                this.info = response;
                console.log("email link sent");
                this.email = "";
                this.loading = false;
                this.toastmsg = "Email Sent";
                this.$bvToast.show ('info-toast');
                // this.toast("Email Sent!");
              })
              .catch(function (error) {
                console.log(error);
                this.loading = false;
                alert(error.message);
              });
          } else {
            console.log(user);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          if (err.code == "UserNotFoundException") {
            alert(err.message + " - " + "Please Sign Up first.");
          } else alert(err.message);
        });
    },
  },
};
</script>
