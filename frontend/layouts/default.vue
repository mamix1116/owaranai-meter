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
    const ogpImage = () => {
      switch (this.$i18n.locale) {
        case 'ko':
        case 'zh-tw':
        case 'en':
          return `https://owaranai.tokyo/ogp-${this.$i18n.locale}.png`
        default:
          return 'https://owaranai.tokyo/ogp.png'
      }
    }
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
          content: ogpImage(),
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: '1200',
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: '630',
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
