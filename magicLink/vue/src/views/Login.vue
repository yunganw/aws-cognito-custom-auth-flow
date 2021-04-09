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
                        <button name="reset_my_password" type="submit" class="btn btn-primary submitButton-customizable">Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import * as axios from 'axios';

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
            
            // let challengeResponse = "the answer for the challenge";

            Auth.signIn(this.email)
            .then(user => {
                console.log ('user:' , user);
                if (user.challengeName === 'CUSTOM_CHALLENGE') {
                    axios
                        .post('https://api.yungangwu.myinstance.com/magiclink/',{
                                username: user.username,        
                                email: this.email,
                                session: user.Session,
                            })
                        .then(response => (this.info = response))
                        .catch(function (error) { 
                            console.log(error);
                        });

                    console.log ("email link sent");
                    // to send the answer of the custom challenge
                    // Auth.sendCustomChallengeAnswer(user, challengeResponse)
                    //     .then(user => console.log(user))
                    //     .catch(err => console.log(err));
                } else {
                    console.log(user);
                }
            })
            .catch(err => console.log(err));
        }
    },
};
</script>
