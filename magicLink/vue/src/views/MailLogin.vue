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
                    <h1>Magic Login</h1>
                    <span>Enter your Email address below, <br/> we will send you a mgaic link to login.</span>
                    <form @submit.prevent="login">
                        <br/>
                        <input name="email" id="email" class="form-control inputField-customizable" placeholder="Email address..."
                                autocapitalize="none" required aria-label="email" value="" type="email" v-model="email">
                        <button name="confirm" type="submit" class="btn btn-primary submitButton-customizable">Confirm</button>
                        <input type="button" value="Cancel" class="btn btn-info submitButton-customizable" aria-label="Cancel"
                                                               onclick="window.location.href='/'"/>
                    </form>
                </div>
                <div>
                    <p class="redirect-customizable"><span>Need an account?</span>&nbsp;<a
                                    href="/register">Sign up</a></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
        };
    },
    methods: {
        
        async login() {
            Auth.configure({
                authenticationFlowType: 'CUSTOM_AUTH'
            });
            
            Auth.signIn(this.email)
            .then(user => {
                if (user.challengeName === 'CUSTOM_CHALLENGE') {
                    localStorage.setItem(
                        'cognitoUser',
                        JSON.stringify({
                            username: this.email,
                            session: user.Session,
                        })
                    )
                    alert ("Email Sent!");
                    this.email = '';
                } else {
                    console.log(user);
                }
            })
            .catch(err => {
                console.log(err);
                if (err.code == 'UserNotFoundException') {
                    alert (err.message + ' - ' + 'Please Sign Up first.');
                }
                else alert (err.message);
            });
        }
    },
};
</script>
