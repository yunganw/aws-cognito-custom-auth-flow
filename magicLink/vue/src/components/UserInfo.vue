<template>
<div class="container">
<div class="main-container">
  <div class="left-sidebar">
    <div class="inner">
      <div class="user-profile">
        <div class="user-background"></div>
        <div v-if="this.email ? 1===1: 1===0" class="user-image">
          <img v-bind:src="'https://gravatar.com/avatar/' + this.gravatar">
        </div>
        <div v-else class="user-image">
          <img src="https://gravatar.com/avatar/000000">
        </div>
        <div class="user-info">
                    <p class="user-name">
                        <i class="icon ion-md-mail"> </i>
                        {{this.email ? this.email : "--"}}
                    </p>

                    <p class="user-title">Role: </p>
                    <p class="user-content">{{this.role ? this.role : "--"}}</p>
                    <p class="user-title">Group: </p>
                    <p class="user-content">{{this.group ? this.group : "--"}}</p>
                    <p class="user-title"> Token Expires: </p>
                    <p class="user-content">{{this.exp ? this.exp : "--"}} </p>
                    <p class="user-content">{{this.timezone ? this.timezone : ""}} </p>

        </div>
      </div>
      <div class="main-menu"></div>
      <div class="social-links">
        <a href="#"><i class="icon ion-logo-facebook"></i></a>
        <a href="#"><i class="icon ion-logo-twitter"></i></a>
        <a href="#"><i class="icon ion-logo-instagram"></i></a>
      </div>
    </div>
    <div class="toggle-button" v-on:click="toogle()"><i class="icon ion-md-arrow-dropleft"></i></div>
  </div>
  <div class="main-content">
    
    <div class="modal timer-display">
      <div class="heading"> 
        <h3>Daily UI #014</h3> 
        <h2>Countdown Timer</h2>
      </div>
      <div class="countdown-timer-large">
        <div class="animatedBackground"></div>
        <div class="info">
          <div class="header">
            <h2>Stay Tuned</h2>
          </div>
          <div class="countdown">
            <div>
              <p>169</p>
              <p>days</p>
            </div>
            <div>
              <p>10</p>
              <p>hours</p>
            </div>
            <div>
              <p>31</p>
              <p>minutes</p>
            </div>
            <div>
              <p>01</p>
              <p>seconds</p>
            </div>
          </div>
        </div>
      </div>
      <div class="countdown-timer-small">
        <div class="backgroundImage"></div>
        <div class="countdown">
            <div>
              <p>169</p>
              <p>days</p>
            </div>
            <div>
              <p>10</p>
              <p>hours</p>
            </div>
            <div>
              <p>31</p>
              <p>minutes</p>
            </div>
            <div>
              <p>01</p>
              <p>seconds</p>
            </div>
          </div>
        <div class="animated-clock-face"></div>
      </div>
    </div>
    

    
  </div>
  <div class="right-sidebar">
    <div class="btn open-music-btn"><i class="icon ion-md-musical-notes"></i></div>
    <div class="btn open-timer-btn"><i class="icon ion-md-timer"></i></div>
    <div class="btn open-chat-btn"><i class="icon ion-md-chatbubbles"></i></div>
  </div>
</div>
</div>
</template>

<style scoped lang="scss">
  @import "../assets/styles/userinfo.scss";
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
import * as CryptoJS from 'crypto-js';

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
           gravatar: '',
       };
   },
   mounted: function () {
       this.username = this.$route.params.username;
       this.role = this.$route.params.role;
       this.email = this.$route.params.email;
       this.group = this.$route.params.group;
       this.exp = this.$route.params.exp;
       this.timezone = this.$route.params.timezone;
       this.gravatar = CryptoJS.MD5((this.email? this.email: "").trim().toLowerCase()).toString();
       console.log ('UserInfo:', this.username, this.role, this.email);

       document.querySelector('body').setAttribute('style', 'background-color:#0a1022');
       document.querySelector('.user-background').setAttribute('style', 
        'background: url("https://gravatar.com/avatar/'+ this.gravatar +'")');
    },
    beforeDestroy() {
        document.querySelector('body').removeAttribute('style')
    },
    methods: {
      toogle () {
        document.querySelector('.left-sidebar').classList.toggle('minimize');
      }
    }
}
</script>
