<template>
  <b-button variant="success">
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    {{this.loading? "" : this.normalText}}
  </b-button>
</template>
<script>
export default {
  name: "LoadingButton",
  props: {
    loading: Boolean,
    normalText: String,
    loadingText: String
  },
}
</script>
