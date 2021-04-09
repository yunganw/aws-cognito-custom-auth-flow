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
            
            Auth.signIn(this.email)
            .then(user => {
                if (user.challengeName === 'CUSTOM_CHALLENGE') {
                    axios
                        .post('https://api.yungangwu.myinstance.com/magiclink/',{
                                username: user.username,        
                                email: this.email,
                                session: user.Session,
                            })
                        .then(response => {
                            this.info = response;
                            console.log ("email link sent");
                            this.email = "";
                            alert ("Email Sent!");
                        })
                        .catch(function (error) { 
                            console.log(error);
                        });
                } else {
                    console.log(user);
                }
            })
            .catch(err => console.log(err));
        }
    },
};
</script>
