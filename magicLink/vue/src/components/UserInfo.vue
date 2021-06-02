<template>
  <div class="container">
    <div class="main-container">
      <div class="left-sidebar">
        <div class="inner">
          <div class="user-profile">
            <div class="user-background"></div>
            <div v-if="this.email ? 1 === 1 : 1 === 0" class="user-image">
              <img
                v-bind:src="'https://gravatar.com/avatar/' + this.gravatar"
              />
            </div>
            <div v-else class="user-image">
              <img src="https://gravatar.com/avatar/000000" />
            </div>
            <div class="user-info">
              <p class="user-name">
                <i class="icon ion-md-mail"> </i>
                {{ this.email ? this.email : "--" }}
              </p>
              <p class="user-title">Role:</p>
              <p class="user-content">{{ this.role ? this.role : "--" }}</p>
              <p class="user-title">Group:</p>
              <p class="user-content">{{ this.group ? this.group : "--" }}</p>
              <p class="user-title">Token Expires:</p>
              <p class="user-content">{{ this.exp ? this.exp : "--" }}</p>
              <p class="user-content">
                {{ this.timezone ? this.timezone : "" }}
              </p>
            </div>
          </div>
          <div class="main-menu">
            <div v-show="this.email ? 1 === 1 : 1 === 0" class="text-center">
              <b-button
                size="sm"
                variant="outline-dark"
                class="text-light"
                v-on:click="logout()"
              >
                <b-icon icon="power" aria-hidden="true"></b-icon>
                Logout
              </b-button>
            </div>
          </div>
          <div class="social-links">
            <a href="#"><i class="icon ion-logo-facebook"></i></a>
            <a href="#"><i class="icon ion-logo-twitter"></i></a>
            <a href="#"><i class="icon ion-logo-instagram"></i></a>
          </div>
        </div>
        <div class="toggle-button" v-on:click="toogle()">
          <i class="icon ion-md-arrow-dropleft"></i>
        </div>
      </div>
      <div class="main-content"></div>
      <div class="right-sidebar"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../assets/styles/userinfo.scss";
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
import * as CryptoJS from "crypto-js";
import { Auth } from "@aws-amplify/auth";

export default {
  name: "UserInfo",
  data() {
    return {
      username: "",
      role: "",
      email: "",
      group: "",
      exp: "",
      timezone: "",
      gravatar: "",
    };
  },
  mounted: function () {
    window.localStorage.removeItem("idtoken", "");
    window.localStorage.removeItem("username", "");

    try {
      Auth.currentSession()
        .then((data) => this.transformUserInfo(data.getIdToken().getJwtToken()))
        .catch((err) => console.log(err));
    } catch {
      console.log("no user valid session");
    }

    document
      .querySelector("body")
      .setAttribute("style", "background-color:#0a1022");
    document
      .querySelector(".user-background")
      .setAttribute(
        "style",
        'background: url("https://gravatar.com/avatar/' + this.gravatar + '")'
      );
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
  methods: {
    toogle() {
      document.querySelector(".left-sidebar").classList.toggle("minimize");
    },
    transformUserInfo(idtoken) {
      const tokens = idtoken.split(".");
      const tokenObj = JSON.parse(Buffer.from(tokens[1], "base64").toString());
      const currentDate = new Date(tokenObj["exp"] * 1000);

      (this.username = tokenObj["cognito:username"]),
        (this.role = tokenObj["cognito:roles"]),
        (this.group = tokenObj["cognito:groups"]),
        (this.email = tokenObj["email"]),
        (this.exp = currentDate.toLocaleString()),
        (this.timezone = currentDate
          .toString()
          .match(/\((.*)\)/)
          .pop()),
        (this.gravatar = CryptoJS.MD5(
          (this.email ? this.email : "").trim().toLowerCase()
        ).toString());
    },
    async logout() {
      Auth.signOut({ global: true })
        .then((data) => {
          console.log("logout:", data);
        })
        .catch((err) => console.log(err));

      Auth.signOut();
      this.$router.push("/");
    },
  },
};
</script>
