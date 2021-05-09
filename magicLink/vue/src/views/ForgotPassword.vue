<template>
      <div class="container">
        <div class="modal-dialog">
            <div class="modal-content background-customizable modal-content-mobile">
                <div>
                    <div class="banner-customizable">
                        <center>
                            
                        </center>
                    </div>
                </div>
                <div class="modal-body">
                    <div v-if="state === 'loading'">
    
    <h1>Forgot your password?</h1>
    <span>Enter your Username below and we will send a message to reset your password</span>
    <form name="forgotpasswordform" @submit.prevent="forgotpassword">
        <br/>
        <input name="username" id="username" class="form-control inputField-customizable" type="text" placeholder="Username"
               autocapitalize="none" required aria-label="username" v-model="username">
        <button name="reset_my_password" type="submit" class="btn btn-primary submitButton-customizable"
            > Reset my password</button>
    </form>
</div>
<div v-else-if="state === 'confirmpwd'">
<div>
    
    <form name="confirmforgotpasswordform" @submit.prevent="changepassword">
        <input type="hidden" class="form-control inputField-customizable" id="username" name="username" value="nomfa">
        <input type="hidden" class="form-control inputField-customizable" id="destination" name="destination" value="s***@g***.com">
        <input type="hidden" class="form-control inputField-customizable" id="deliveryMedium" name="deliveryMedium" value="EMAIL">
        
        
        <br>
        <div id="div-forgot-password-msg">
            <span id="text-code">We have sent a password reset code by email to {{this.email}}. Enter it below to reset your password.</span>
        </div>
        <label for="forgot_password_code">Code</label>
        <input id="forgot_password_code" v-model="code" class="form-control inputField-customizable" type="password" name="code" required="">

        <label for="new_password">New Password</label>
        <input id="new_password" v-model="newpassword" class="form-control inputField-customizable" type="password" name="password" required="">

        <label for="confirm_password">Enter New Password Again</label>
        <input id="confirm_password" v-model="newpwddup" class="form-control inputField-customizable" type="password" name="confirmPassword" required="">


        <button name="reset_password" type="submit" class="btn btn-primary submitButton-customizable">Change Password</button>
    </form>
</div>


</div>


                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import '../assets/styles/bootstrap.css';
@import '../assets/styles/cognito-login.css';
</style>
<script>
   import { Auth } from 'aws-amplify';
   
   export default {
      name: 'ForgotPassword',
      data() {
          return {
            username: '',
            email: '',
            state: 'loading',
            newpassword: '',
            newpwddup: '',
            code: '',
          }
      },
      methods: {
          forgotpassword () {
              if (this.username.length > 0) {
                Auth.forgotPassword (this.username)
                    .then (response => { 
                        console.log ('forgotpwd: ', response);
                        this.email = response.CodeDeliveryDetails.Destination;
                    })
                    .catch (err => console.error (err));
                this.state = 'confirmpwd';
              }
          },
          changepassword () {
              if (this.code.length < 6) {
                  alert ("input correct code!");
              }
              else if (this.newpassword.length < 5) {
                  alert ("input valid password!");
              }
              else if (this.newpassword !== this.newpwddup) {
                  alert ("password not match!");
              }
              else {
                  Auth.forgotPasswordSubmit (this.username, this.code, this.newpassword)
                  .then ( () => {
                      alert ('New password applied, please sign-in');
                      this.$router.push('/');
                  })
                  .catch (err => alert (err));
              }
          }


      }
   }
</script>