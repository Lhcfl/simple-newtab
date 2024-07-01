import type { Column, LinkItem } from '@/types/columns';
import type { Ref } from 'vue';

export type IdNullable<T> = {
  [K in Exclude<keyof T, 'id'>]: T[K];
};

export abstract class ColumnsManager {
  abstract getColumns(): Promise<Ref<Column[]>>;

  abstract title: Ref<string>;

  abstract move(
    id: string,
    details: {
      fromIndex: number;
      toIndex: number;
      fromId?: string | null;
      toId?: string | null;
    },
  ): Promise<void>;

  abstract createLinkItem(parentId: string, item: IdNullable<LinkItem>): Promise<LinkItem>;
  abstract createColumn(item: IdNullable<Column>): Promise<Column>;
  abstract remove(id: string): Promise<void>;
  abstract updateLinkItem(id: string, item: LinkItem): Promise<LinkItem>;
  abstract updateColumn(id: string, item: Column): Promise<Column>;

  abstract removeEmptyColumn(): Promise<void>;
}
