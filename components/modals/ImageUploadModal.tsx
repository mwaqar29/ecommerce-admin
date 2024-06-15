"use client"

import "@uppy/core/dist/style.min.css"
import "@uppy/dashboard/dist/style.min.css"

import { useCallback, useEffect, useState } from "react"
import Uppy, { UppyFile } from "@uppy/core"
import { Dashboard } from "@uppy/react"
import toast from "react-hot-toast"
import supabase from "@/lib/supabase"

import { useImageUploadModal } from "@/hooks/useImageUploadModal"
import { Modal } from "@/components/ui/modal"

const ImageUploadModal = () => {
  const imageUploadModal = useImageUploadModal()
  const [selectedFile, setSelectedFile] = useState<UppyFile | null>()

  // IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(
    () =>
      new Uppy({
        restrictions: {
          maxFileSize: 5000000,
          maxNumberOfFiles: 1,
          allowedFileTypes: ["image/*"],
        },
      }),
  )

  const handleModalClose = useCallback(() => {
    if (selectedFile) uppy.removeFile(selectedFile.id)
    imageUploadModal.onClose()
    setSelectedFile(null)
  }, [imageUploadModal, selectedFile, uppy])

  useEffect(() => {
    async function uploadImage(file: File) {
      if (!supabase || !file) return
      const { data, error } = await supabase.storage
        .from("ecommerce-images")
        .upload(file.name, file)
      if (error) {
        console.log(error)
        toast.error("Error in uploading image!")
      } else {
        getImage(data.path)
        toast.success("Image Uploaded Successfully.")
        handleModalClose()
      }
    }

    const getImage = (path: string) => {
      if (!supabase || !path) return
      const { data } = supabase.storage
        .from("ecommerce-images")
        .getPublicUrl(path)
      imageUploadModal.setImageUrl(data.publicUrl)
    }

    const onUppyFileAdd = (file: UppyFile) => {
      setSelectedFile(file as UppyFile)
    }

    const onUppyFileRemoved = (file: UppyFile) => {
      setSelectedFile(null)
    }

    const onUppyFileUpload = () => {
      uploadImage(selectedFile?.data as File)
    }

    uppy.on("file-added", onUppyFileAdd)
    uppy.on("file-removed", onUppyFileRemoved)
    uppy.on("upload", onUppyFileUpload)

    return () => {
      uppy.off("file-added", onUppyFileAdd)
      uppy.off("file-removed", onUppyFileRemoved)
      uppy.off("upload", onUppyFileUpload)
    }
  }, [handleModalClose, imageUploadModal, selectedFile, uppy])

  return (
    <Modal
      title="Upload"
      description="Upload an Image"
      isOpen={imageUploadModal.isOpen}
      onClose={handleModalClose}
      extraClass="w-max max-w-full"
    >
      <Dashboard
        uppy={uppy}
        height={400}
        showProgressDetails={true}
        note="Only 1 image is allowed. Max file size limit: 5MB."
        locale={{
          strings: {
            dropPasteFiles: "Drop image here or %{browseFiles}",
            dropHint: "Drop your image here",
          },
        }}
        theme="light"
      />
    </Modal>
  )
}

export default ImageUploadModal
