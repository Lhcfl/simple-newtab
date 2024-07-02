import type { Column, LinkItem } from '@/types/columns';
import { ref, watch, type Ref } from 'vue';
import { ColumnsManager, type IdNullable } from './columns-manager';
import i18next from 'i18next';

export class BookmarksColumnManager extends ColumnsManager {
  rootId?: string;

  title: Ref<string>;

  data: Ref<Column[]>;

  constructor(rootId?: string) {
    super();
    this.rootId = rootId !== '0' ? rootId : undefined;
    if (this.rootId) {
      this.title = ref('');
      chrome.bookmarks.get(this.rootId).then((node) => {
        this.title.value = node[0]?.title;
        this.watch_title();
      });
    } else {
      this.title = ref(i18next.t('bookmark'));
    }
    this.data = ref([]);
    this.update_data();
    chrome.bookmarks.onChanged.addListener(() => this.update_data());
    chrome.bookmarks.onRemoved.addListener(() => this.update_data());
    chrome.bookmarks.onCreated.addListener(() => this.update_data());
    chrome.bookmarks.onChildrenReordered.addListener(() => this.update_data());
    chrome.bookmarks.onMoved.addListener(() => this.update_data());
    chrome.bookmarks.onImportEnded.addListener(() => this.update_data());
  }

  private watch_title() {
    watch(this.title, (v, ov) => {
      if (v != ov && v && this.rootId) {
        chrome.bookmarks.update(this.rootId, {
          title: v,
        });
      }
    });
  }

  private async update_data() {
    this.data.value = (await this.fetch_columns()).value;
  }

  private async fetch_columns() {
    const tree = (
      this.rootId
        ? await chrome.bookmarks.getSubTree(this.rootId)
        : await chrome.bookmarks.getTree()
    )[0];

    return ref<Column[]>(
      tree
        .children!.map((node) => ({
          id: node.id,
          title: node.title,
          items:
            node.children?.map((childNode) => ({
              id: childNode.id,
              title: childNode.title,
              url: childNode.url ?? `/bookmarks/${childNode.id}`,
            })) ?? [],
        }))
        .filter((col) => col.items.length > 0),
    );
  }

  async getColumns() {
    return this.data;
  }

  async remove(id: string) {
    await chrome.bookmarks.remove(id);
  }

  async move(
    id: string,
    details: {
      fromIndex: number;
      toIndex: number;
      fromId?: string | null | undefined;
      toId?: string | null | undefined;
    },
  ) {
    const parentId = details.toId ?? undefined;
    const diff =
      (!parentId || details.fromId === details.toId) && details.toIndex > details.fromIndex ? 1 : 0;
    await chrome.bookmarks.move(id, {
      parentId: details.toId ?? undefined,
      index: details.toIndex + diff,
    });
  }

  async createLinkItem(parentId: string, item: IdNullable<LinkItem>): Promise<LinkItem> {
    const res = await chrome.bookmarks.create({
      parentId,
      ...item,
    });

    return {
      ...item,
      id: res.id,
    };
  }

  async createColumn(item: IdNullable<Column>): Promise<Column> {
    const res = await chrome.bookmarks.create({
      parentId: this.rootId,
      title: item.title,
    });

    return {
      ...item,
      id: res.id,
    };
  }

  async updateColumn(id: string, item: Column): Promise<Column> {
    await chrome.bookmarks.update(id, { title: item.title });

    return item;
  }

  async updateLinkItem(id: string, item: LinkItem): Promise<LinkItem> {
    await chrome.bookmarks.update(id, { title: item.title });

    return item;
  }

  async removeEmptyColumn() {
    // do nothing
  }
}
