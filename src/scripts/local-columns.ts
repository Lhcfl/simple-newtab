import type { Column, LinkItem } from '@/types/columns';
import { useStorage } from '@vueuse/core';
import type { Ref } from 'vue';
import { ColumnsManager, type IdNullable } from './columns-manager';

const example_columns: Column[] = [
  {
    id: crypto.randomUUID(),
    title: 'This is a column.',
    items: [
      {
        id: crypto.randomUUID(),
        title: 'Github',
        url: 'https://github.com/',
      },
      {
        id: crypto.randomUUID(),
        title: 'You can drag them.',
        url: 'chrome://newtab',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Column 2.',
    items: [
      {
        id: crypto.randomUUID(),
        title: 'Cloudflare',
        url: 'https://www.cloudflare.com/',
      },
      {
        id: crypto.randomUUID(),
        title: 'Google Translate',
        url: 'https://translate.google.com/',
      },
    ],
  },
];

export class LocalColumnManager extends ColumnsManager {
  data: Ref<Column[]>;
  title = useStorage('newTabTitle', 'The New Tab!!', localStorage);

  constructor(storageKey = 'newTabColumns') {
    super();
    this.data = useStorage(storageKey, example_columns, localStorage);
  }

  async getColumns(): Promise<Ref<Column[]>> {
    let ret = JSON.parse(JSON.stringify(this.data.value)) as Column[];

    ret = ret.filter((c) => c.items.length > 0);
    for (const c of ret) {
      if (!c.id) c.id = crypto.randomUUID();
      for (const l of c.items) {
        if (!l.id) l.id = crypto.randomUUID();
      }
    }

    this.data.value = ret;

    return this.data;
  }

  async createColumn(item: IdNullable<Column>) {
    const column = {
      id: crypto.randomUUID(),
      ...item,
    };
    this.data.value = this.data.value.concat(column);
    return column;
  }

  async createLinkItem(parentId: string, item: IdNullable<LinkItem>) {
    const appended = {
      id: crypto.randomUUID(),
      ...item,
    };
    for (const col of this.data.value) {
      if (col.id === parentId) {
        col.items = col.items.concat(appended);
        return appended;
      }
    }
    throw new Error(`no such parent id: ${parentId}`);
  }

  async move(
    id: string,
    details: { fromIndex: number; toIndex: number; fromId?: string | null; toId?: string | null },
  ) {
    console.log('moving ', id, ':', details);
    this.data.value = this.data.value!;
  }

  async updateColumn(id: string, item: Column): Promise<Column> {
    this.data.value = this.data.value.map((col) => (col.id === id ? item : col));
    return item;
  }
  async updateLinkItem(id: string, item: LinkItem): Promise<LinkItem> {
    for (const col of this.data.value) {
      col.items = col.items.map((it) => (it.id === id ? item : it));
      return item;
    }
    throw new Error(`no such id: ${id}`);
  }
  async remove(id: string): Promise<void> {
    this.data.value = this.data.value.filter((col) => col.id !== id);
    for (const col of this.data.value) {
      col.items = col.items.filter((it) => it.id !== id);
    }
  }

  async removeEmptyColumn() {
    this.data.value = this.data.value.filter((col) => col.items.length > 0);
  }
}
