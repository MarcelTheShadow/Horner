<!-- In der App.vue sind durch router-view alle 3 Seiten enthalten, es ist eine SPA -->

<script setup>
</script>
<template>
  <!-- Start der App mittels Router -->
  <div class="App">
    <router-view />
  </div>
</template>

<!-- Style über ganze Anwendung hinweg sichtbar -->
<style scoped>
.App {
  background-color: lightseagreen;
  margin: 0;
  height: 100vh;
  width: 100vw;
}
</style>
