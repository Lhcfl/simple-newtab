<script setup lang="ts">
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, nextTick, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { settings } from '@/settings_store';
const { t } = useTranslation();

const model = defineProps<{
  title: string;
  url: string;
}>();

const emit = defineEmits<{
  'update:title': [title: string];
}>();

const inputer = ref<HTMLInputElement | null>(null);
const editing = ref(false);

const title = ref(model.title);

function focus() {
  editing.value = true;
  nextTick(() => {
    inputer.value?.focus();
  });
}

function focusout() {
  if (editing.value === true) {
    emit('update:title', title.value);
    title.value = model.title;
  }
  editing.value = false;
}

function keydown(ev: KeyboardEvent) {
  if (ev.code === 'Enter') {
    focusout();
  }
}

const iconURL = computed(() => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', model.url);
  url.searchParams.set('size', '32');
  return url.toString();
});

const isFolder = computed(() => model.url.startsWith('/'));

const iconDisabled = computed(() => settings.bool_configs.value.disable_img);
</script>

<template>
  <div class="editable-link">
    <input v-if="editing" ref="inputer" v-model="title" @keydown="keydown" @focusout="focusout" />
    <template v-else-if="isFolder">
      <FontAwesomeIcon :icon="far.faFolder" />
      <RouterLink :to="model.url">
        {{ model.title ?? 'No title' }}
      </RouterLink>
    </template>
    <template v-else>
      <img v-if="!iconDisabled" :src="iconURL" width="16" height="16" />
      <a :href="model.url"> {{ model.title ?? 'No title' }} </a>
    </template>
    <div class="control-group" v-if="!editing">
      <button class="edit-button" @click="focus">{{ t('edit') }}</button>
      <button class="edit-button" @click="emit('update:title', '')" v-if="!isFolder">
        {{ t('remove') }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.editable-link
  a,input
    width 100%
.control-group
  float right
  button
    font-size inherit
    background none
    border none
    color var(--color-text)

.edit-button
  opacity 0
  transition all 0.3s
  .editable-link:hover &
    opacity 1
  &:hover
    color var(--color-heading)
</style>
