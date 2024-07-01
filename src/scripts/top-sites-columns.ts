import type { Column, LinkItem } from '@/types/columns';
import { ref } from 'vue';
import { ColumnsManager } from './columns-manager';

export class TopSitesColumnManager extends ColumnsManager {
  title = ref('Top Sites');

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
    throw 'WILL NOT IMPLEMENT';
  }

  async createColumn(): Promise<Column> {
    throw 'WILL NOT IMPLEMENT';
  }

  async updateColumn(): Promise<Column> {
    throw 'WILL NOT IMPLEMENT';
  }

  async updateLinkItem(): Promise<LinkItem> {
    throw 'WILL NOT IMPLEMENT';
  }

  async removeEmptyColumn() {
    // do nothing
  }
}
