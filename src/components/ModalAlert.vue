<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
</script>

<template>
  <VueFinalModal
    class="modal-container message-box"
    content-class="message-box-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <h1>{{ title }}</h1>
    <slot />
    <button @click="emit('confirm')">OK</button>
  </VueFinalModal>
</template>

<style lang="stylus">
.modal-container.message-box
  display: flex
  justify-content: center
  align-items: center
  .message-box-content
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--color-background);
    border-radius: 0.5rem;
    font-size 1rem
    max-width 500px
    min-width 200px
    & > * + *
      margin: 0.5rem 0;
    & h1
      font-size: 1.375rem;
    & button
      padding 10px
      font-size 1rem
      border 1px solid var(--color-heading)
      background var(--color-background)
      color var(--color-text)
      transition all 0.3s
      &:hover
        background var(--color-background-mute)
</style>
