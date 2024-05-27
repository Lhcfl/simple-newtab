<script setup lang="ts">
import { nextTick, ref } from 'vue';

const text = defineModel<string>({ required: true });

defineProps<{
  minWidth?: number;
}>();

const inputer = ref<HTMLInputElement | null>(null);
const editing = ref(false);

function focus() {
  editing.value = true;
  nextTick(() => {
    inputer.value?.focus();
  });
}

function focusout() {
  editing.value = false;
}

function keydown(ev: KeyboardEvent) {
  if (ev.code === 'Enter') {
    focusout();
  }
}
</script>

<template>
  <input v-if="editing" ref="inputer" v-model="text" @keydown="keydown" @focusout="focusout" />
  <button type="button" v-else-if="text" class="editable-text" @click="focus" :style="{ minWidth }">
    {{ text }}
  </button>
  <button
    type="button"
    v-else
    class="editable-text"
    @click="focus"
    :style="{ opacity: 0, minWidth }"
  >
    Set Text
  </button>
</template>

<style scoped lang="stylus">
.editable-text
  font-size inherit
  background none
  border none
  cursor pointer
  color var(--color-heading)
</style>
