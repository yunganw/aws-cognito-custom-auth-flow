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
    name: 'Hogwarts',
    data() {
        return {
            info: '',
        };
    },
    mounted: function() {
      axios 
        .post('https://api.yungangwu.myinstance.com/magicresponse/',{
          prewarm: 'yes',        
        })
        .then(response => {
            console.log (response.data.body);
            axios
                .post('https://api.yungangwu.myinstance.com/magicresponse/',{
                    prewarm: 'no',        
                    username: this.$route.query.username,        
                    magicstring: this.$route.query.answer,
                })
                .then(response => (this.info=response.data.body))
                .catch(function (error) { 
                console.log(error);
            });          
        })
        .catch(function (error) { 
           console.log(error);
        });
    },
    methods: {
        getName(info) {
             //decode name
            console.log ('info', info);
            
            if (info != "") {
                let obj = JSON.parse(info);
                const tokens = obj.IdToken.split(".");
                
                console.log ('id_token', tokens[1]);
                
                return (JSON.stringify(JSON.parse(Buffer.from(tokens[1], 'base64').toString()), null, "\t"));
            }
            
            return "";
        }
    },
};
</script>
