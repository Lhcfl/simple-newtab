<template>
  <h1 class="page-title">
    <EditableText v-if="manager" v-model="manager.title.value" :min-width="100" />
  </h1>
  <main ref="mainRef" @wheel.prevent="listener">
    <draggable
      v-if="columns"
      tag="div"
      class="columns"
      :component-data="{
        tag: 'div',
        name: 'list',
      }"
      v-model="columns"
      item-key="id"
      @end="dragEnd"
    >
      <template #item="{ element: column }: { element: Column }">
        <div class="column" :key="column.id" :data-id="column.id">
          <EditableText
            class="column-title"
            :min-width="100"
            :model-value="column.title"
            @update:modelValue="
              (t) => manager.updateColumn(column.id, { ...column, title: t }).catch(alertError)
            "
          />
          <draggable
            tag="ul"
            class="column-items"
            :component-data="{
              tag: 'ul',
              name: 'list',
            }"
            v-model="column.items"
            @end="dragEnd"
            group="link-item"
            item-key="id"
          >
            <template #item="{ element: link }: { element: LinkItem }">
              <li
                class="list-item"
                :key="link.id"
                :data-id="link.id"
                @click="
                  (e) => {
                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'div')
                      routeTo(link.url);
                  }
                "
              >
                <EditableLink
                  :title="link.title"
                  :url="link.url"
                  @update:title="
                    (t) => {
                      if (t) {
                        manager
                          .updateLinkItem(link.id, {
                            ...link,
                            title: t,
                          })
                          .catch(alertError);
                      } else {
                        manager
                          .remove(link.id)
                          .then(() => {
                            manager.removeEmptyColumn().catch(alertError);
                          })
                          .catch(alertError);
                      }
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
                  manager
                    .createLinkItem(column.id, {
                      title,
                      url,
                    })
                    .catch(alertError);
                }
              "
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="column add-link">
          <AddLink
            title=""
            url=""
            @success="
              (title, url) => {
                manager
                  .createColumn({ title: 'untitled', items: [] })
                  .then((col) => {
                    manager.createLinkItem(col.id, { title, url }).catch(alertError);
                  })
                  .catch(alertError);
              }
            "
          />
        </div>
      </template>
    </draggable>
  </main>
  <button class="float add-favorite btn btn-link" v-if="isBookmarkPage" @click="toggleFavorite">
    {{ isFavoratedPage ? t('remove_from_nav') : t('add_to_nav') }}
  </button>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { computed, ref, shallowRef, watch, type Ref } from 'vue';
import { useTitle } from '@vueuse/core';
import EditableText from '@/components/EditableText.vue';
import type { Column, LinkItem } from '@/types/columns';
import EditableLink from '@/components/EditableLink.vue';
import AddLink from '@/components/AddLink.vue';
import { LocalColumnManager } from '@/scripts/local-columns';
import type { ColumnsManager } from '@/scripts/columns-manager';
import router from '@/router';
import { BookmarksColumnManager } from '@/scripts/bookmarks-columns';
import { useRoute } from 'vue-router';
import { TopSitesColumnManager } from '@/scripts/top-sites-columns';
import { storage } from '@/store';
import { useMessageBox } from '@/scripts/message-box';
import { useTranslation } from 'i18next-vue';
const { t } = useTranslation();

const props = defineProps<{
  rootId?: string;
  source: 'bookmark' | 'local' | 'topsites';
}>();

const route = useRoute();

const mainRef = ref<HTMLElement | null>(null);

const manager = shallowRef<ColumnsManager>(null as unknown as ColumnsManager);

const columns_ref: Ref<Ref<Column[]> | null> = ref(null);

const columns = computed(() => columns_ref.value?.value);

watch(
  route,
  async () => {
    if (props.source === 'local') {
      manager.value = new LocalColumnManager();
    } else if (props.source === 'bookmark') {
      manager.value = new BookmarksColumnManager(route.params.id as string);
    } else if (props.source === 'topsites') {
      manager.value = new TopSitesColumnManager();
    }

    useTitle(manager.value.title);

    columns_ref.value = await manager.value.getColumns();
  },
  { immediate: true },
);

function routeTo(url: string) {
  if (url.startsWith('/')) {
    router.push(url);
  } else {
    window.location.href = url;
  }
}

function dragEnd(e: {
  oldIndex: number;
  newIndex: number;
  item: HTMLElement;
  from: HTMLElement;
  to: HTMLElement;
}) {
  manager.value
    .move(e.item.getAttribute('data-id')!, {
      fromIndex: e.oldIndex,
      toIndex: e.newIndex,
      fromId: e.from.parentElement?.getAttribute('data-id'),
      toId: e.to.parentElement?.getAttribute('data-id'),
    })
    .catch(alertError);
}

function alertError(e: Error | string) {
  console.log(e);
  useMessageBox('Error', typeof e === 'string' ? e : e.message).open();
}

const listener = (e: WheelEvent) => {
  mainRef.value?.scrollTo({
    // behavior: 'smooth',
    left: mainRef.value.scrollLeft + e.deltaY,
  });
};

const isBookmarkPage = computed(
  () => props.source === 'bookmark' && route.params.id != null && route.params.id != '0',
);

const isFavoratedPage = computed(() =>
  storage.favoratedBookmarks.value.includes(route.params.id as string),
);

function toggleFavorite() {
  if (!isBookmarkPage.value) return;
  if (isFavoratedPage.value) {
    storage.favoratedBookmarks.value = storage.favoratedBookmarks.value.filter(
      (x) => x != route.params.id,
    );
  } else {
    storage.favoratedBookmarks.value = storage.favoratedBookmarks.value.concat([
      route.params.id.toString(),
    ]);
  }
}
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
  max-width 400px

.list-item:hover
  background-color rgba(50, 255, 50, 0.15)

ul.column-items
  list-style none
  padding-left 20px

.column-title
  font-size 25px

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
    margin-left: 50px
    font-size 20px

.float.add-favorite
  position fixed
  right 10px
  bottom 10px
</style>
