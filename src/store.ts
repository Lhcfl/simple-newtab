import { useStorage } from '@vueuse/core';

export const storage = {
  lang: useStorage('lang', undefined as string | undefined, localStorage),
  defaultHome: useStorage('defaultHome', '/', localStorage),
  favoratedBookmarks: useStorage('favoratedBookmarks', [] as string[], localStorage),
};
