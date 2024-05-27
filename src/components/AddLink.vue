<script setup lang="ts">
import { nextTick, ref } from 'vue';

const emit = defineEmits<{
  success: [title: string, url: string];
}>();

const inputerUrl = ref<HTMLInputElement | null>(null);
const inputerTitle = ref<HTMLInputElement | null>(null);
const editing = ref(false);

const title = ref('');
const url = ref('');

function focus() {
  editing.value = true;
  title.value = '';
  url.value = '';
  nextTick(() => {
    inputerUrl.value?.focus();
  });
}

function focusout() {
  if (editing.value === true && url.value) {
    emit('success', title.value || url.value, url.value);
  }
  editing.value = false;
}

function keydown(ev: KeyboardEvent) {
  if (ev.code === 'Enter') {
    focusout();
  }
}
</script>

<template>
  <div class="add-link" :class="{ editing }">
    <div v-if="editing">
      <input
        ref="inputerTitle"
        v-model="title"
        @keydown="
          (ev) => {
            if (ev.code === 'Enter') {
              inputerUrl?.focus();
            }
          }
        "
        placeholder="Title"
      />
      <br />
      <input ref="inputerUrl" v-model="url" @keydown="keydown" placeholder="URL" />
    </div>
    <button class="edit-button" v-if="editing" @click="focusout">完成</button>
    <button class="edit-button" v-else @click="focus">添加</button>
  </div>
</template>

<style scoped lang="stylus">

.edit-button
  font-size inherit
  background none
  border none
  color var(--color-text)
  transition all 0.3s
  &:hover
    color var(--color-heading)
</style>
