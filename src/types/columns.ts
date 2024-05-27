export interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export interface Column {
  id: string;
  title: string;
  items: LinkItem[];
}
