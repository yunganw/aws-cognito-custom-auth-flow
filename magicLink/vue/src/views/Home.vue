<template>
  <div class="home">
    <header class="app-header"></header>
    <HelloWorld msg=""/>
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
