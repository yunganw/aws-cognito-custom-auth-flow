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
                    <h1>Welcome</h1>
                    <span>User: </span>
                    <center>
                      {{getName(this.info)}}
                    </center>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as axios from 'axios';

export default {
    name: 'Social',
    data() {
        return {
            info: '',
        };
    },
    mounted: function() {
      console.log ('Authorization Code:', this.$route.query.code);

      const url = 'https://magiclink.auth.us-east-1.amazoncognito.com/oauth2/token';

      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', '235qakl0if7b3vss5ikehppnmi');
      params.append('code', this.$route.query.code);
      params.append('redirect_uri', 'https://magiclink-yunganw.netlify.app/social');

      const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      };

      axios.post(url, params, config)
        .then(response => {
            //this.info=JSON.stringify(response.data);
            this.info = response.data;
        })
        .catch(error => console.log(error)); 
    },
    methods: {
        getName(info) {
            //decode name
            console.log ('info', info);
            
            const tokens = info.id_token.split(".");
            
            console.log ('id_token', tokens[1]);
            
            return (JSON.stringify(JSON.parse(Buffer.from(tokens[1], 'base64').toString()), null, "\t"));
        }
    },
};
</script>
