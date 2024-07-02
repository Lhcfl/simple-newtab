<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import { RouterView } from 'vue-router';
import { storage } from './store';
import { computed, ref, type Ref } from 'vue';
import i18n from './i18n';
import { useTranslation } from 'i18next-vue';
const { t, i18next } = useTranslation();

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
    <RouterLink to="/bookmarks/0">{{ t('bookmark') }}</RouterLink>
    <RouterLink to="/local"> {{ t('local') }}</RouterLink>
    <RouterLink to="/topsites">{{ t('top_sites') }}</RouterLink>
    <a v-if="favoratedBookmarks.length > 0">|</a>
    <RouterLink v-for="item in favoratedBookmarks" :key="item.id" :to="`/bookmarks/${item.id}`">
      {{ item.name.value }}
    </RouterLink>
  </nav>
  <RouterView />
  <footer class="page-footer-left">
    <button
      class="btn btn-link"
      v-for="(v, langCode) in i18n.resources"
      @click="
        () => {
          i18next.changeLanguage(langCode);
          storage.lang.value = langCode;
        }
      "
      :key="langCode"
      :class="{ active: langCode === i18next.language }"
    >
      {{ v._lang }}
    </button>
  </footer>
  <ModalsContainer />
</template>

<style scoped>
main {
  width: 100%;
}
nav > a {
  margin-right: 20px;
}
footer.page-footer-left {
  position: absolute;
  left: 10px;
  bottom: 10px;
}
</style>
