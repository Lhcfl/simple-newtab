<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import { RouterView } from 'vue-router';
</script>

<template>
  <nav>
    <RouterLink to="/bookmarks/0">Bookmark</RouterLink>
    <RouterLink to="/local">Local</RouterLink>
    <RouterLink to="/topsites">Top Sites</RouterLink>
  </nav>
  <RouterView />
  <ModalsContainer />
</template>

<style scoped>
main {
  width: 100%;
}
nav > a {
  margin-right: 20px;
}
</style>
