import { create } from "zustand";

interface StripeSubscriptionStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useStripeSubscriptionModal = create<StripeSubscriptionStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useStripeSubscriptionModal;
