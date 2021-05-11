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
          <div v-if="state === 'loading'">
            <h2>Forgot password</h2>
            <br />
            <span
              >Forgot your password? Type in your email address in the form
              below to reset your password</span
            >
            <form id="forgotpasswordform" @submit.prevent="forgotpassword">
              <br />
              <input
                name="username"
                id="username"
                class="form-control inputField-customizable"
                type="text"
                placeholder="Username"
                autocapitalize="none"
                required
                aria-label="username"
                v-model="username"
              />
              <br />
              <b-button
                variant="success"
                type="submit"
                form="forgotpasswordform"
                value="Submit"
              >
                Submit
              </b-button>
              <a class="redirect-customizable" href="/">
                Return to login</a
              >
            </form>
          </div>
          <div v-else-if="state === 'confirmpwd'">
            <div v-if="forgotpasswordlink === 'false'">
              <form
                name="confirmforgotpasswordform"
                @submit.prevent="changepassword"
              >
                <br />
                <div id="div-forgot-password-msg">
                  <span id="text-code"
                    >We have sent a password reset code by email to
                    {{ this.email }}. Enter it below to reset your
                    password.</span
                  >
                </div>
                <label for="forgot_password_code">Code</label>
                <input
                  id="forgot_password_code"
                  v-model="code"
                  class="form-control inputField-customizable"
                  type="password"
                  name="code"
                  required=""
                />

                <label for="new_password">New Password</label>
                <input
                  id="new_password"
                  v-model="newpassword"
                  class="form-control inputField-customizable"
                  type="password"
                  name="password"
                  required=""
                />

                <label for="confirm_password">Enter New Password Again</label>
                <input
                  id="confirm_password"
                  v-model="newpwddup"
                  class="form-control inputField-customizable"
                  type="password"
                  name="confirmPassword"
                  required=""
                />

                <button
                  name="reset_password"
                  type="submit"
                  class="btn btn-primary submitButton-customizable"
                >
                  <span>Change Password</span>
                </button>
              </form>
            </div>
            <div v-else>
              <span>
                The password reset link has been sent to {{ this.email }}
              </span>
              <p></p>
              <a class="redirect-customizable" href="/">
                Return to login</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Auth } from "aws-amplify";
import awsconfig from "../aws-exports";

export default {
  name: "ForgotPassword",
  data() {
    return {
      username: "",
      email: "",
      state: "loading",
      newpassword: "",
      newpwddup: "",
      code: "",
      forgotpasswordlink: "false",
    };
  },
  mounted: function () {
    this.forgotpasswordlink = awsconfig.forgot_password_link;
  },
  methods: {
    forgotpassword() {
      if (this.username.length > 0) {
        Auth.forgotPassword(this.username)
          .then((response) => {
            console.log("forgotpwd: ", response);
            this.email = response.CodeDeliveryDetails.Destination;
          })
          .catch((err) => console.error(err));
        this.state = "confirmpwd";
      }
    },
    changepassword() {
      if (this.code.length < 6) {
        alert("input correct code!");
      } else if (this.newpassword.length < 5) {
        alert("input valid password!");
      } else if (this.newpassword !== this.newpwddup) {
        alert("password not match!");
      } else {
        Auth.forgotPasswordSubmit(this.username, this.code, this.newpassword)
          .then(() => {
            alert("New password applied, please sign-in");
            this.$router.push("/");
          })
          .catch((err) => alert(err));
      }
    },
  },
};
</script>