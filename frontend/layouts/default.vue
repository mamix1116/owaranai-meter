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
    CommonFooter,
  },
  head() {
    return {
      title: this.$tc('title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$tc('lead'),
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$tc('title'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$tc('lead'),
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: this.$tc('title'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://owaranai.tokyo/ogp.png',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `https://owaranai.tokyo${this.$route.path}`,
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.main-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
