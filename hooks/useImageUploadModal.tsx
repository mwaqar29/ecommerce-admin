import { create } from "zustand"

interface useImageUploadModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  imageUrls: string[]
  setImageUrls: (param: string[]) => void
  maxFiles: number
  setMaxFiles: (param: number) => void
  note: string
  setNote: (param: string) => void
}

export const useImageUploadModal = create<useImageUploadModalStore>()(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    imageUrls: [],
    setImageUrls: (param) => set({ imageUrls: param }),
    maxFiles: 0, // 0 means Unlimited
    setMaxFiles: (param) => set({ maxFiles: param }),
    note: "",
    setNote: (param) => set({ note: param }),
  }),
)
