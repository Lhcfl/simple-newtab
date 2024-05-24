<template>
  <h1 class="page-title">
    <EditableText v-model="pageTitle" :min-width="100" />
  </h1>
  <main ref="mainRef">
    <draggable
      tag="div"
      class="columns"
      :component-data="{
        tag: 'div',
        name: 'list',
      }"
      v-model="columns"
      @start="columnDragging = true"
      @end="columnDragging = false"
      item-key="id"
    >
      <template #item="{ element: column }: { element: Column }">
        <div class="column" :key="column.id">
          <draggable
            tag="ul"
            class="column-items"
            :component-data="{
              tag: 'ul',
              name: 'list',
            }"
            v-model="column.items"
            @start="itemDragging = true"
            @end="itemDragging = false"
            group="link-item"
            item-key="id"
          >
            <template #item="{ element: link }: { element: LinkItem }">
              <li
                class="list-item"
                :key="link.id"
                @click="
                  (e) => {
                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'div') routeTo(link.url)
                  }
                "
              >
                <EditableLink
                  :title="link.title"
                  :url="link.url"
                  @update:title="
                    (t) => {
                      if (t) link.title = t
                      else column.items = column.items.filter((l) => l.id !== link.id)

                      columns = columns.filter((c) => c.items.length > 0)
                    }
                  "
                />
              </li>
            </template>
            <template></template>
          </draggable>
          <div>
            <AddLink
              class="add-item"
              title=""
              url=""
              @success="
                (title, url) => {
                  column.items = column.items.concat([
                    {
                      id: getRandomUUID(),
                      title,
                      url,
                    },
                  ])
                }
              "
            />
          </div>
        </div>
      </template>
    </draggable>
    <div class="column add-link">
      <AddLink
        title=""
        url=""
        @success="
          (title, url) => {
            columns = columns.concat([
              {
                id: getRandomUUID(),
                title: '',
                items: [
                  {
                    id: getRandomUUID(),
                    title,
                    url,
                  },
                ],
              },
            ])
          }
        "
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { onMounted, onUnmounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import EditableText from '@/components/EditableText.vue'
import { storage } from '@/store'
import type { Column, LinkItem } from '@/types/columns'
import EditableLink from '@/components/EditableLink.vue'
import AddLink from '@/components/AddLink.vue'

const columnDragging = ref(false)
const itemDragging = ref(false)
const mainRef = ref<HTMLElement | null>(null)

const pageTitle = storage.newTabTile

const columns = getColumns()

function routeTo(url: string) {
  window.location.href = url
}

function getColumns() {
  let ret = JSON.parse(JSON.stringify(storage.newTabColumns.value)) as Column[]

  ret = ret.filter((c) => c.items.length > 0)
  for (const c of ret) {
    if (!c.id) c.id = getRandomUUID()
    for (const l of c.items) {
      if (!l.id) l.id = getRandomUUID()
    }
  }

  storage.newTabColumns.value = ret

  return storage.newTabColumns
}

useTitle(pageTitle)

const listener = (e: WheelEvent) => {
  e.preventDefault()
  mainRef.value?.scrollTo({
    behavior: 'smooth',
    left: mainRef.value.scrollLeft + e.deltaY,
  })
}

function getRandomUUID() {
  return crypto.randomUUID()
}

onMounted(() => {
  console.log(mainRef.value)
  mainRef.value?.addEventListener('wheel', listener, { passive: true })
})

onUnmounted(() => {
  mainRef.value?.removeEventListener('wheel', listener)
})
</script>

<style lang="stylus" scoped>

.sortable-chosen
  background-color rgba(50, 255, 50, 0.15)
  &.list-item
    scale 1.05

.page-title
  margin-bottom 40px
  > button
    font-weight 600


main
  overflow-y hidden;
  overflow-x auto;
  display flex

.add-item
.list-item
  font-size 20px

.add-item
  opacity 0
  transition all 0.3s
  &.editing,
  .column:hover &
    opacity 1

.columns
  display flex
  max-height 90vh
.column
  flex-shrink: 0
  min-width: 200px
  min-height: 500px
  width fix-content
  &.add-link
    margin-left: 450px
</style>
