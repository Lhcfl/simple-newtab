<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterLink to="/bookmarks/0">Bookmark</RouterLink>
  <RouterLink to="/local">Local</RouterLink>
  <RouterView />
  <ModalsContainer />
</template>

<style scoped>
main {
  width: 100%;
}
</style>
