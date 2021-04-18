<template>
<div class="container">
   <div class="main-container">
       <div class="modal-body">
       <div class="left-sidebar">
           <div class="inner">
               <div class="user-profile">
                   <div class="user-background"></div>
                     <div class="user-image">
                       <img src="https://gravatar.com/avatar/acd0be988874771459704b56b9422cbe">
                     </div>
                    <div class="user-info1">
                    <p class="user-name">
                            Email: {{this.email ? this.email : "NA"}}
                    </p>
                    </div><div class="user-info">
                    <p class="user-title">Role: </p>
                    <p class="user-content">{{this.role ? this.role : "NA"}}</p>
                    <p class="user-title">Group: </p>
                    <p class="user-content">{{this.group ? this.group : "NA"}}</p>
                    <p class="user-title"> Token Expires: </p>
                    <p class="user-content">{{this.exp ? this.exp : "NA"}} </p>
                    <p class="user-content">{{this.timezone ? this.timezone : "NA"}} </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Maven+Pro|Oswald');
@import '../assets/styles/userinfo.css';
</style>

<script>
export default {
   name: 'UserInfo',
   data() {
       return {
           username: '',
           role: '',
           email: '',
           group: '',
           exp: '',
           timezone: '',
       };
   },
   mounted: function () {
       this.username = this.$route.params.username;
       this.role = this.$route.params.role;
       this.email = this.$route.params.email;
       this.group = this.$route.params.group;
       this.exp = this.$route.params.exp;
       this.timezone = this.$route.params.timezone;
       console.log ('UserInfo:', this.username, this.role, this.email);
   },
}
</script>
