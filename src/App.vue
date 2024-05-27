<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import NewPage from './pages/NewPage.vue';
</script>

<template>
  <NewPage />
  <ModalsContainer />
</template>

<style scoped>
main {
  width: 100%;
}
</style>
