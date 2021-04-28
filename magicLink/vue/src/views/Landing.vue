<template>
   <div class="container">
      <div class="modal-dialog">
         <div class="modal-content background-customizable modal-content-mobile visible-xs visible-sm">
            <div>
                  <div class="banner-customizable">
                     <center>
                     </center>
                  </div>
            </div>
            <div class="modal-body">
                <div>
                    <center>
                        <b-spinner variant="primary" label="Spinning" /><p></p>
                        <span > Loading
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
   import { Auth, Hub } from 'aws-amplify';

   export default {
      name: 'Landing',
      mounted: function () {
            Hub.listen('auth', ({ payload: { event, data } }) => {
               switch (event) {
                  case 'cognitoHostedUI':
                     Auth.currentAuthenticatedUser().then(userData => {
                        console.log ("user",userData);
                        this.transitUserInfo(userData);
                     });
                     break;
                  case 'signOut':
                     // setUser(null);
                     break;
                  case 'signIn_failure':
                  case 'cognitoHostedUI_failure':
                     console.log('Sign in failure', data);
                     break;
               }
            });
         },
         methods: {
            transitUserInfo (userData) {
               const tokens = userData.signInUserSession.idToken.jwtToken.split('.');
               const tokenObj = JSON.parse(Buffer.from(tokens[1], 'base64').toString());
               const currentDate = new Date(tokenObj["exp"]*1000);
               
               this.$router.push({
                  name: "UserInfo",
                  params: {
                     username: tokenObj["cognito:username"],
                     role: tokenObj["cognito:roles"],
                     group: tokenObj["cognito:groups"],
                     email: tokenObj["email"],
                     exp: currentDate.toLocaleString(),
                     timezone: currentDate.toString().match(/\((.*)\)/).pop(),
                  }
               });
            },
      }
   }
</script>