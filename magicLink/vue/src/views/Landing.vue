<template>
  <div class="container">
    <div class="modal-dialog">
      <div
        class="modal-content background-customizable modal-content-mobile visible-xs visible-sm"
      >
        <div>
          <div class="banner-customizable">
            <center></center>
          </div>
        </div>
        <div class="modal-body">
          <div>
            <center>
              <b-spinner variant="primary" label="Spinning" />
              <p></p>
              <span>
                Loading
                <b-icon icon="three-dots" animation="cylon"></b-icon>
              </span>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Auth } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import * as axios from "axios";
import awsconfig from "../aws-exports";
const MAGICLINKUSER_URL = awsconfig.magiclinkuser_url;
const IDP_PREFIX_NAMES = awsconfig.idp_prefix_names;

export default {
  name: "Landing",
  mounted: function () {
    const fedIdtoken = window.localStorage.getItem("idtoken");
    const fedUsername = window.localStorage.getItem("username");
    // const fedIdpname = window.localStorage.getItem("idpname");
    console.log("local items:", fedIdtoken, fedUsername);

    if (fedIdtoken && fedIdtoken.length > 0) {
      window.localStorage.removeItem("idtoken");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("idpname");
      
      this.exchangeToken(fedUsername, fedIdtoken);
    }

    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "cognitoHostedUI":
          Auth.currentAuthenticatedUser().then((userData) => {
            console.log("user", userData);
            const pattern = /(.+(?=_))/;
            const matches = userData.username.match(pattern);
            const fedUserIdToken = userData.signInUserSession.idToken.jwtToken;
            // const email = userData.attributes.email;

            if (matches && IDP_PREFIX_NAMES.includes(matches[0])) {
              // alert (matches[0]);
              const headers = {
                "Content-Type": "application/json",
                Authorization: fedUserIdToken,
              };
              axios
                .get(MAGICLINKUSER_URL, {
                  headers: headers,
                })
                .then((response) => {
                  // FedUser deleted - need to get native user tokens.
                  console.log("userlinked", response);
                  window.localStorage.setItem("idtoken", fedUserIdToken);
                  window.localStorage.setItem(
                    "username",
                    userData.attributes.email 
                  );
                  window.localStorage.setItem("idpname", matches[0]);

                  // console.log('awsconfig', awsconfig);
                  // let oauth = {
                  //   domain: awsconfig.oauth.domain,
                  //   scope: awsconfig.oauth.scope,
                  //   redirectSignIn: awsconfig.oauth.redirectSignIn,
                  //   redirectSignOut: awsconfig.oauth.redirectSignOutLinkUser,
                  //   redirectSignOutLinkUser: awsconfig.oauthredirectSignOutLinkUser,
                  //   responseType: awsconfig.oauth.responseType
                  // };
                  // let configUpdate = awsconfig;
                  // configUpdate.oauth = oauth;
                  // console.log ('configUpdate', configUpdate);
                  // Amplify.configure (configUpdate);
                  Auth.signOut();
                  //                    this.toast("Email Sent!");
                })
                .catch(function (error) {
                  console.log(error);
                  // this.loading = false;
                  // this.toast(error.message, "warning");
                });
            } 
            else // this.transitUserInfo(userData);
              this.$router.push("/userinfo");
          });
          break;
        case "signOut":
          // setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });
  },
  methods: {
    // transitUserInfo(userData) {
    //   const tokens = userData.signInUserSession.idToken.jwtToken.split(".");
    //   const tokenObj = JSON.parse(Buffer.from(tokens[1], "base64").toString());
    //   const currentDate = new Date(tokenObj["exp"] * 1000);

    //   this.$router.push({
    //     name: "UserInfo",
    //     params: {
    //       username: tokenObj["cognito:username"],
    //       role: tokenObj["cognito:roles"],
    //       group: tokenObj["cognito:groups"],
    //       email: tokenObj["email"],
    //       exp: currentDate.toLocaleString(),
    //       timezone: currentDate
    //         .toString()
    //         .match(/\((.*)\)/)
    //         .pop(),
    //     },
    //   });
    // },
    async exchangeToken(username, federatedUserIdToken) {
      Auth.configure({
        authenticationFlowType: "CUSTOM_AUTH",
      });

      let challengeResponse = federatedUserIdToken;

      Auth.signIn(username, null, { type: "linkuser" })
        .then((user) => {
          if (user.challengeName === "CUSTOM_CHALLENGE") {
            // to send the answer of the custom challenge
            Auth.sendCustomChallengeAnswer(user, challengeResponse)
              .then((user) => {
                console.log("exchanged:", user);
                this.$router.push("/userinfo");
                // this.transitUserInfo(user);
              }) //user)
              .catch((err) => console.log(err));
          } else {
            console.log(user);
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>