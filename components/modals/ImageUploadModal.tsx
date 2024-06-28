"use client"

import "@uppy/core/dist/style.min.css"
import "@uppy/dashboard/dist/style.min.css"

import { useCallback, useEffect, useMemo, useState } from "react"
import Uppy, { UppyFile } from "@uppy/core"
import { Dashboard } from "@uppy/react"
import toast from "react-hot-toast"
import supabase from "@/lib/supabase"
import { useTheme } from "next-themes"

import { useImageUploadModal } from "@/hooks/useImageUploadModal"
import { Modal } from "@/components/ui/modal"

const ImageUploadModal = () => {
  const imageUploadModal = useImageUploadModal()
  const [selectedFiles, setSelectedFiles] = useState<UppyFile[]>([])
  const { theme } = useTheme()

  // IMPORTANT: pasing an initializer function to prevent Uppy from being reinstantiated on every render except when the dependencies change.
  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: {
        maxFileSize: 5000000,
        maxNumberOfFiles: imageUploadModal.maxFiles,
        allowedFileTypes: ["image/*"],
      },
    })
  }, [imageUploadModal.maxFiles])

  const handleModalClose = useCallback(() => {
    if (selectedFiles?.length) {
      selectedFiles.forEach((imgFile) => {
        uppy.removeFile(imgFile.id)
      })
    }
    imageUploadModal.onClose()
    setSelectedFiles([])
  }, [imageUploadModal, selectedFiles, uppy])

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
        return data.path
      }
    }

    const getImage = (path: string) => {
      if (!supabase || !path) return
      const { data } = supabase.storage
        .from("ecommerce-images")
        .getPublicUrl(path)

      return data.publicUrl
    }

    const onUppyFileAdd = (files: UppyFile[]) => {
      let imgArr: UppyFile[] = JSON.parse(JSON.stringify(selectedFiles))
      imgArr = [...imgArr, ...files]
      setSelectedFiles(imgArr)
    }

    const onUppyFileRemoved = (file: UppyFile) => {
      let imgArr: UppyFile[] = JSON.parse(JSON.stringify(selectedFiles))
      imgArr = imgArr.filter((img) => img.id === file.id)
      setSelectedFiles(imgArr)
    }

    const onUppyFileUpload = async () => {
      if (!selectedFiles?.length) return
      const uploadPromises = selectedFiles.map((imgFile) =>
        uploadImage(imgFile?.data as File),
      )
      try {
        const results = await Promise.all(uploadPromises)
        toast.success("Image(s) Uploaded Succesfully!")
        if (imageUploadModal.maxFiles == 1) {
          const imgUrl = getImage(results[0]!)
          if (imgUrl) imageUploadModal.setImageUrls([imgUrl])
        } else {
          const imgUrlArr = [...imageUploadModal.imageUrls]
          results.forEach((path) => {
            const imgUrl = getImage(path!)
            if (imgUrl) imgUrlArr.push(imgUrl)
          })
          imageUploadModal.setImageUrls(imgUrlArr)
        }
        handleModalClose()
      } catch (error) {
        console.log("Something went wrong in uploading images!")
      }
    }

    uppy.on("files-added", onUppyFileAdd)
    uppy.on("file-removed", onUppyFileRemoved)
    uppy.on("upload", onUppyFileUpload)

    return () => {
      uppy.off("files-added", onUppyFileAdd)
      uppy.off("file-removed", onUppyFileRemoved)
      uppy.off("upload", onUppyFileUpload)
    }
  }, [handleModalClose, imageUploadModal, selectedFiles, uppy])

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
        note={imageUploadModal.note}
        locale={{
          strings: {
            dropPasteFiles: "Drop image here or %{browseFiles}",
            dropHint: "Drop your image here",
          },
        }}
        theme={
          theme === "system" ? "auto" : theme === "dark" ? "dark" : "light"
        }
      />
    </Modal>
  )
}

export default ImageUploadModal
