<template>
  <h1 class="page-title">
    {{ t('settings.title') }}
  </h1>
  <main>
    <p v-for="(value, key) in bool_configs" :key="key">
      <input
        type="checkbox"
        :checked="value"
        @change="
          (v) => {
            console.log(v);
            bool_configs[key] = !bool_configs[key];
          }
        "
      />
      <span class="description"> {{ t(`settings.bool.${key}`) }} </span>
    </p>
    <section>
      <h3>{{ t(`settings.custom_css`) }}</h3>
      <p class="description">{{ t('settings.reload_to_save') }}</p>
      <textarea v-model="custom_css"></textarea>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { settings } from '@/settings_store';
const { t } = useTranslation();

const bool_configs = settings.bool_configs;
const custom_css = settings.custom_css;
</script>

<style lang="stylus" scoped>
.description
  margin-left: 10px
input
  scale 150%
textarea
  width 300px
  height 200px
  resize both
</style>
