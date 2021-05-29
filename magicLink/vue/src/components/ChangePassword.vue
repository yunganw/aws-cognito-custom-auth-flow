<template>
  <div>
      <h2>Change password</h2>
      <br />
      <form id="changepasswordform" @submit.prevent="changePassword">
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
        <br />
        <b-button
          variant="success"
          type="submit"
          form="changepasswordform"
          value="Submit"
        >
          <span>Change Password</span>
        </b-button>
        <a class="redirect-customizable" href="/"> Return to login</a>
      </form>
    </div>
</template>
<script>
import { Auth } from "aws-amplify";

export default {
  name: "ChangePassword",
  props: {
    user: Object,
  },
  data() {
    return {
      loading: false,
      newpassword: "",
      newpwddup: "",
    };
  },
  mounted: function () {
    console.log("cpwd", this.user);
    if (!this.user) this.toast("Please start from login", "warning");
  },
  methods: {
    toast(msg, type = "info") {
      this.$bvToast.toast(msg, {
        title: type,
        toaster: "b-toaster-top-center",
        solid: true,
        static: true,
        appendToast: true,
        variant: type === "info" ? "success" : type,
      });
    },
    transitUserInfo(userData) {
      const tokens = userData.signInUserSession.idToken.jwtToken.split(".");
      const tokenObj = JSON.parse(Buffer.from(tokens[1], "base64").toString());
      const currentDate = new Date(tokenObj["exp"] * 1000);

      this.$router.push({
        name: "UserInfo",
        params: {
          username: tokenObj["cognito:username"],
          role: tokenObj["cognito:roles"],
          group: tokenObj["cognito:groups"],
          email: tokenObj["email"],
          exp: currentDate.toLocaleString(),
          timezone: currentDate
            .toString()
            .match(/\((.*)\)/)
            .pop(),
        },
      });
    },
    changePassword() {
      console.log("pwd change.");
      if (this.newpassword.length < 5) {
        this.toast("input valid password!", "warning");
      } else if (this.newpassword !== this.newpwddup) {
        this.toast("password not match!", "warning");
      } else {
        this.loading = true;
        Auth.completeNewPassword(
          this.user, // the Cognito User Object
          this.newpassword // the new password
        )
          .then((user) => {
            this.loading = false;
            // at this time the user is logged in if no MFA required
            console.log(user);
            this.transitUserInfo(user);
          })
          .catch((e) => {
            this.loading = false;
            this.toast(e.message, "warning");
          });
      }
    },
  },
};
</script>