<script setup lang="ts">
import { nextTick, ref } from 'vue'

const model = defineProps<{
  title: string
  url: string
}>()

const emit = defineEmits<{
  'update:title': [title: string]
}>()

const inputer = ref<HTMLInputElement | null>(null)
const editing = ref(false)

const title = ref(model.title)

function focus() {
  editing.value = true
  nextTick(() => {
    inputer.value?.focus()
  })
}

function focusout() {
  if (editing.value === true) {
    emit('update:title', title.value)
    title.value = model.title
  }
  editing.value = false
}

function keydown(ev: KeyboardEvent) {
  if (ev.code === 'Enter') {
    focusout()
  }
}
</script>

<template>
  <div class="editable-link">
    <input v-if="editing" ref="inputer" v-model="title" @keydown="keydown" @focusout="focusout" />
    <a v-else :href="model.url"> {{ model.title ?? 'No title' }} </a>

    <div class="control-group" v-if="!editing">
      <button class="edit-button" @click="focus">编辑</button>
      <button class="edit-button" @click="emit('update:title', '')">删除</button>
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
