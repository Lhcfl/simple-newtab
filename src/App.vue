<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import { RouterView } from 'vue-router';
import { storage } from './store';
import { computed, ref, type Ref } from 'vue';

const favoratedBookmarks = computed(() => {
  const res: {
    id: string;
    name: Ref<string>;
  }[] = [];
  for (const id of storage.favoratedBookmarks.value) {
    res.push({
      id,
      name: getBookmarkName(id),
    });
  }
  return res;
});
function getBookmarkName(bookmarkid: string): Ref<string> {
  const res = ref(bookmarkid);
  chrome.bookmarks.get(bookmarkid).then((node) => {
    res.value = node[0]?.title;
  });
  return res;
}
</script>

<template>
  <nav>
    <RouterLink to="/bookmarks/0">Bookmark</RouterLink>
    <RouterLink to="/local">Local</RouterLink>
    <RouterLink to="/topsites">Top Sites</RouterLink>
    <a v-if="favoratedBookmarks.length > 0">|</a>
    <RouterLink v-for="item in favoratedBookmarks" :key="item.id" :to="`/bookmarks/${item.id}`">
      {{ item.name.value }}
    </RouterLink>
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
