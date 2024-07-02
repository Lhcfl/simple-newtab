import i18next from 'i18next';

// @ts-ignore
import resources from 'virtual:i18next-loader';
import { storage } from './store';

i18next.init({
  lng: storage.lang.value,
  fallbackLng: 'en-US',
  resources,
});

const i18n = {
  i18next,
  resources: resources as Record<string, { _lang: string; translation: Record<string, any> }>,
};

export default i18n;
