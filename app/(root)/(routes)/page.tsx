"use client"

import { useStoreModal } from "@/hooks/useStoreModal"
import { useEffect } from "react"

export default function RootPage() {
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return <div className="p-4">Root Page</div>
}
