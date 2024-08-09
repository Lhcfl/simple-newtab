import { useStorage, type RemovableRef } from '@vueuse/core';

const SETTINGS_CONFIG_DEFAULT = {
  bool_configs: {
    disable_img: false,
  },
  custom_css: '',
};

export const settings: {
  [K in keyof typeof SETTINGS_CONFIG_DEFAULT]: RemovableRef<(typeof SETTINGS_CONFIG_DEFAULT)[K]>;
} = {} as never;

for (const [key, val] of Object.entries(SETTINGS_CONFIG_DEFAULT)) {
  (settings as Record<string, unknown>)[key] = useStorage(`SETT_${key}`, val, localStorage);
}
