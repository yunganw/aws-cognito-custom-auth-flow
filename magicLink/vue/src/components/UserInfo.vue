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

* {
  box-sizing: border-box;
}

.main-container {
  color: #fff;
  width: 50%;/*100vw;*/
  height: 100vh;
  overflow: hidden; 
  font-family: "Maven Pro";
}
.left-sidebar {
    max-width: 360px;
}
.inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      }
.user-profile {
        flex-grow: 2;
        max-height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.5s;
        border: #1a233d;
        position: relative;
        overflow: hidden;
        
        }
        
 .user-background {
          position: absolute;
          background: url('https://gravatar.com/avatar/acd0be988874771459704b56b9422cbe');
          background-size: cover;
          width: 100%;
          height: 100%;
          filter: blur(25px);
          z-index: -1;
        }
        
        .user-image {
          margin: 50px 0 25px 0;
          border-color: hsl(225, 40%, 17%);
          transition: all 0.5s;
        }
        img {
            width: 90px;
            border-radius: 50%;
            border: 6px solid rgba(255, 255, 255, 0.1);
            transition: all 0.5s;
        }
        .user-info1 {
          text-align: center;
          
          }        
        .user-info {
          text-align: left;
          
          }
          .user-name {
            font-family: 'Oswald';
            font-weight: 400;
            text-transform: uppercase;
          }
          .user-title {
              text-decoration:underline;
          }
          .user-content {
            color: #D1D3DA;
          }
        
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
