import { useStorage } from '@vueuse/core';

export const storage = {
  defaultHome: useStorage('defaultHome', '/', localStorage),
};
