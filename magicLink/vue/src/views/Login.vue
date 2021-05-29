<template>
  <div>
    <header class="app-header"></header>
    <div class="container">
      <div class="modal-dialog">
        <center>
          <!-- <b-toast id="info-toast" title="info" static solid variant="success">
          {{toastmsg}}
        </b-toast> -->
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
            <form id="emailform" @submit.prevent="login">
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
                :disabled="loading"
              />
              <br />
              <b-button variant="success" form="emailform" type="submit">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ this.loading ? "Sending..." : "Confirm" }}
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
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import * as axios from "axios";
import awsconfig from "../aws-exports";
// import LoadingButton from "../components/LoadingButton";

const MAGICLINKURL = awsconfig.magiclink_url;

export default {
  name: "Login",
  // components: {
  //   LoadingButton,
  // },
  data() {
    return {
      toastmsg: "",
      email: "",
      loading: false,
    };
  },
  methods: {
    toast(msg, type = "info") {
      this.$bvToast.toast(msg, {
        title: type,
        toaster: "b-toaster-top-center",
        solid: true,
        static: true,
        appendToast: true,
        // noAutoHide: true,
        variant: type === "info" ? "success" : "warning",
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
                // this.$bvToast.show ('info-toast');
                this.toast("Email Sent!");
              })
              .catch(function (error) {
                console.log(error);
                this.loading = false;
                this.toast(error.message, "warning");
              });
          } else {
            console.log(user);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          if (err.code == "UserNotFoundException") {
            this.toast(
              err.message + " - " + "Please Sign Up first.",
              "warning"
            );
          } else this.toast(err.message, "warning");
        });
    },
  },
};
</script>
