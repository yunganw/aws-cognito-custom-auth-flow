<template>
  <div class="container">
    <div class="modal-dialog">
      <div class="modal-content background-customizable modal-content-mobile">
        <div>
          <div class="banner-customizable">
            <center></center>
          </div>
        </div>
        <div class="modal-body">
          <h2>Magic Login</h2>
          <br/>
          <span
            >Enter your Email address below, <br />
            we will send you a mgaic link to login.</span
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
            <br/>
            <b-button
              name="confirm"
              type="submit"
              variant="success"
            >
              Confirm
            </b-button>
              <a class="redirect-customizable" href="/" style="font-size: 14px">
                Return to login</a
              >
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
      email: "",
    };
  },
  methods: {
    async login() {
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
                alert("Email Sent!");
              })
              .catch(function (error) {
                console.log(error);
                alert(error.message);
              });
          } else {
            console.log(user);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.code == "UserNotFoundException") {
            alert(err.message + " - " + "Please Sign Up first.");
          } else alert(err.message);
        });
    },
  },
};
</script>
