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
          <div>
            <div>
              <form
                name="confirmforgotpasswordform"
                @submit.prevent="changepassword"
              >
                <br />
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
                  class="btn btn-success submitButton-customizable"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../assets/styles/bootstrap.css";
@import "../assets/styles/cognito-login.css";
</style>
<script>
import { Auth } from "aws-amplify";

export default {
  name: "ResetPassword",
  data() {
    return {
      username: this.$route.query.username,
      newpassword: "",
      newpwddup: "",
      code: this.$route.query.code,
    };
  },
  //   mounted: function () {
  //       this.code = this.$route.query.code;
  //       this.username = this.$route.query.username;
  //   },
  methods: {
    changepassword() {
      if (this.code.length < 6) {
        console.log("Incorrect code!");
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