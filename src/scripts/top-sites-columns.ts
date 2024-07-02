import type { Column, LinkItem } from '@/types/columns';
import { ref } from 'vue';
import { ColumnsManager } from './columns-manager';
import i18next from 'i18next';

export class TopSitesColumnManager extends ColumnsManager {
  title = ref(i18next.t('top_sites'));

  async getColumns() {
    const res = await chrome.topSites.get();
    return ref(
      [res.slice(0, 10), res.slice(10, 20)].map((list, index) => ({
        id: `topsites-${index}`,
        title: '',
        items: list.map((node) => ({
          id: crypto.randomUUID(),
          title: node.title,
          url: node.url,
        })),
      })),
    );
  }

  async remove() {}

  async move() {}

  async createLinkItem(): Promise<LinkItem> {
    throw Error('Method not allowed');
  }

  async createColumn(): Promise<Column> {
    throw Error('Method not allowed');
  }

  async updateColumn(): Promise<Column> {
    throw Error('Method not allowed');
  }

  async updateLinkItem(): Promise<LinkItem> {
    throw Error('Method not allowed');
  }

  async removeEmptyColumn() {
    // do nothing
  }
}
