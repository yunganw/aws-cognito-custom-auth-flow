<template>
  <div class="home">
    <div v-if="userstate === null">
      <Login />
    </div>
    <div v-else>
      <UserInfo />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Login from '@/components/Login.vue';
import UserInfo from '@/components/UserInfo.vue';
import { Auth } from 'aws-amplify';

export default {
  name: 'Home',
  data() {
    return {
      userstate: null,
    }
  },
  mounted: async function () {
    try {
      this.userstate = await Auth.currentAuthenticatedUser();
      console.log ("user state:", this.userstate);
    }
    catch {
      this.userstate = null;
    }
  },

  components: {
    Login,
    UserInfo
  }

}
</script>
