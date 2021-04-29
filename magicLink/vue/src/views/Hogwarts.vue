<template>
    <div class="container">
         <div class="modal-dialog">
            <div class="modal-content background-customizable modal-content-desktop">
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
// import * as axios from 'axios';
import awsConfig from '../aws-exports';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

export default {
    name: 'Hogwarts',
    data() {
        return {
            info: '',
        };
    },
    mounted: function() {
        let navigate = this.$router;

        const user = JSON.parse(localStorage.getItem('cognitoUser'));

        if (user === undefined || user.username !== this.$route.query.username)
            alert ("Please use the same browser where you start the email login");

        const poolData = {
            UserPoolId: awsConfig.aws_user_pools_id,
            ClientId: awsConfig.aws_user_pools_web_client_id,
        }
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
        const userData = {
            Username: user.username,
            Pool: userPool,
        }
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
        // After this set the session to the previously stored user session
        cognitoUser.Session = user.session
        // rehydrating the user and sending the auth challenge answer directly will not
        // trigger a new email
        cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH')

        cognitoUser.sendCustomChallengeAnswer(this.$route.query.answer, {
            async onSuccess() {
            // If we get here, the answer was sent successfully,
            // but it might have been wrong (1st or 2nd time)
            // So we should test if the user is authenticated now
                
                // This will throw an error if the user is not yet authenticated:
                //const user = 
                Auth.currentAuthenticatedUser()
                .then (userData => console.log (userData))
                .catch (err => console.error (err));

               navigate.push({
                   name: 'Home'
               });
            },
            onFailure(failure) {
                alert (failure);
            },
        })
    },
};
</script>
