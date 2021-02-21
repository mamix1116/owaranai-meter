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
            {
              vmid: 'description',
              name: 'description',
              content: this.$root.$t('lead')
            },
            {
              vmid: 'og:title',
              property: 'og:title',
              content: this.$root.$t('title')
            },
            {
              vmid: 'og:description',
              property: 'og:description',
              content: this.$root.$t('lead')
            },
            {
              vmid: 'og:site_name',
              property: 'og:site_name',
              content: this.$root.$t('title')
            },
            {
              vmid: 'og:image',
              property: 'og:image',
              content: 'https://owaranai.tokyo/ogp.png'
            }
          ]
        }
      : null
  },
  created() {
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
