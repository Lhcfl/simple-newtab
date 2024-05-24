import { useStorage } from '@vueuse/core'
import type { Column } from '@/types/columns'

export const storage = {
  newTabTile: useStorage('newTabTitle', 'The New Tab!!', localStorage),

  newTabColumns: useStorage(
    'newTabColumns',
    [
      {
        title: 'This is a column.',
        items: [
          {
            title: 'Github',
            url: 'https://github.com/',
          },
          {
            title: 'You can drag them.',
            url: 'chrome://newtab',
          },
        ],
      },
      {
        title: 'Column 2.',
        items: [
          {
            title: 'Cloudflare',
            url: 'https://www.cloudflare.com/',
          },
          {
            title: 'Google Translate',
            url: 'https://translate.google.com/',
          },
        ],
      },
    ] as Column[],
    localStorage,
  ),
}
