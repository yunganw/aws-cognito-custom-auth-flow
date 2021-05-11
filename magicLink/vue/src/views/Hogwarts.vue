<template>
  <div class="container">
    <div class="modal-dialog">
      <div class="modal-content background-customizable modal-content-desktop">
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
import * as axios from 'axios';
import awsconfig from '../aws-exports';
const MAGICRESPONSEURL = awsconfig.magicresponse_url; 

export default {
    name: 'Hogwarts',
    mounted: function() {
      axios 
        .post(MAGICRESPONSEURL,{
          prewarm: 'yes',        
        })
        .then(response => {
            console.log (response.data.body);
            axios
                .post(MAGICRESPONSEURL,{
                    prewarm: 'no',        
                    username: this.$route.query.username,        
                    magicstring: this.$route.query.answer,
                })
                .then(response => {
                    if (200 != response.data.statusCode) {
                        alert (response.data.body);
                        this.$router.push("/");
                    }
                    else {
                        let obj = JSON.parse(response.data.body);

                        const tokens = obj.IdToken.split('.');
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
                    }
                })
                .catch(function (error) { 
                    alert(error.message);
                    console.log(error);
            });          
        })
        .catch(function (error) { 
            alert(error.message);
            console.log(error);
        });
    },
};
</script>
