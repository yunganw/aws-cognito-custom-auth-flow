<template>
  <div class="home">
    <header class="app-header"></header>
    <HelloWorld msg="" />
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'


export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  beforeMount: function() {
    const fedIdtoken = window.localStorage.getItem("idtoken");
    const fedUsername = window.localStorage.getItem("username");
    // const fedIdpname = window.localStorage.getItem("idpname");
    console.log("local items:", fedIdtoken, fedUsername);

    if (fedIdtoken && fedIdtoken.length > 0) {
      this.$router.push ("/landing/");
    }
  }
}
</script>
