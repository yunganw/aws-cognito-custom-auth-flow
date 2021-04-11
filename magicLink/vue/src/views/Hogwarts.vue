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
                    <h1>Welcome</h1>
                    <span>User: </span>
                    <center>
                      {{this.info}}
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
                .then(response => (this.info=''+response.data.body))
                .catch(function (error) { 
                console.log(error);
            });          
        })
        .catch(function (error) { 
           console.log(error);
        });  
    },
};
</script>
