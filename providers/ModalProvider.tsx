"use client"

import { useEffect, useState } from "react"

import { StoreModal } from "@/components/modals/StoreModal"
import ImageUploadModal from "@/components/modals/ImageUploadModal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <StoreModal />
      <ImageUploadModal />
    </>
  )
}
