<template>
  <div id="app" class="main-container">
    <router-view />
    <common-footer />
  </div>
</template>

<script>
import CommonFooter from "@/components/CommonFooter";

export default {
  components: {
    CommonFooter
  }
};
</script>

<style>
.main-container {
  padding: 2em;
  max-width: 800px;
  margin: 0 auto;
}
</style>
