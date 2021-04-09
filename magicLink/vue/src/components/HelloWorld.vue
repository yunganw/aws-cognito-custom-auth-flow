<template>
   <div class="container">
      <div class="modal-dialog">
         <div class="modal-content background-customizable modal-content-mobile visible-xs visible-sm">
            <div>
               <div>
                  <div class="banner-customizable">
                     <center>
                     </center>
                  </div>
               </div>
            </div>
            <div class="modal-body">
               <div>
                  <div>
                     <div>
                        <div>
                           <form name="loginWithIdentityProvider" action="" method="post">
                              <div>
                                 <div>
                                    <span class="idpDescription-customizable">Sign in with your corporate ID</span>
                                    <input type="button" value="OIDC" class="btn btn-info idpButton-customizable" aria-label="OIDC"
                                       />
                                    <input type="button" value="SAML" class="btn btn-info idpButton-customizable" aria-label="SAML"
                                       />
                                    <input type="button" value="Email Login" class="btn btn-info idpButton-customizable" aria-label="Email-login"
                                       onclick="window.location.href='/login'"/>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
                  <div>
                     <br/>
                     <span class="legalText-customizable">We won&#39;t post to any of your accounts without asking first</span>
                  </div>
                  <div>
                     <div class="login-or">
                        <hr class="hr-or">
                        <span class="span-or background-customizable ">or</span>
                     </div>
                     <div>
                        <div>
                           <Span class="textDescription-customizable ">Sign in with your username and password</Span>
                           <form action="" class="cognito-asf" onsubmit="getAdvancedSecurityData(this);">
                              <label for="signInFormUsername" class="label-customizable">Username</label>
                              <div>
                                 <input id="signInFormUsername" name="username" type="text" class="form-control inputField-customizable"
                                    placeholder="Username" autocapitalize="none" required>
                              </div>
                              <label for="signInFormPassword" class="label-customizable">Password</label>
                              <div><input id="signInFormPassword" name="password" type="password" class="form-control inputField-customizable"
                                 placeholder="Password"
                                 required></div>
                              <input name="signInSubmitButton" type="Submit" value="Sign in"
                                 class="btn btn-primary submitButton-customizable" aria-label="submit"/>
                              <br/>
                              <div>
                                 <p class="redirect-customizable"><span>Need an account?</span>&nbsp;<a
                                    href="/register">Sign up</a></p>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
