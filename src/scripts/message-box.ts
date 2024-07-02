import ModalAlert from '@/components/ModalAlert.vue';
import { useModal } from 'vue-final-modal';

export function useMessageBox(title: string, content: string) {
  const modal = useModal({
    component: ModalAlert,
    attrs: {
      title,
      onConfirm() {
        modal.close();
      },
    },
    slots: {
      default: content,
    },
  });
  return modal;
}
