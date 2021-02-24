<template>
  <div class="main-container">
    <Nuxt />
    <common-footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CommonFooter from '@/components/CommonFooter.vue'

export default Vue.extend({
  components: {
    CommonFooter
  }
})
</script>

<style lang="scss" scoped>
.main-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
