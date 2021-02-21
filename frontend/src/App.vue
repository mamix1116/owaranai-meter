<template>
  <div id="app" class="main-container">
    <router-view />
    <common-footer />
  </div>
</template>

<script>
import CommonFooter from '@/components/CommonFooter'

export default {
  components: {
    CommonFooter
  },
  data() {
    return {
      initialized: false
    }
  },
  metaInfo() {
    return this.initialized
      ? {
          title: this.$root.$t('title'),
          meta: [
            { name: 'description', content: this.$root.$t('lead') },
            { property: 'og:title', content: this.$root.$t('title') },
            { property: 'og:description', content: this.$root.$t('lead') },
            { property: 'og:site_name', content: this.$root.$t('title') },
            {
              property: 'og:image',
              content: 'https://owaranai.tokyo/ogp.png'
            },
            { property: 'og:url', content: 'https://owaranai.tokyo' },
            { property: 'og:type', content: 'website' },
            { property: 'fb:app_id', content: '812810555941690' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@mamix1116' }
          ]
        }
      : null
  },
  mounted() {
    this.initialized = true
  }
}
</script>

<style>
.main-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
