"use client"

import Image from "next/image"
import { ImagePlus, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { useImageUploadModal } from "@/hooks/useImageUploadModal"

interface ImageUploadProps {
  disabled?: boolean
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const imageUploadModal = useImageUploadModal()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <Button
        type="button"
        disabled={disabled}
        variant="secondary"
        onClick={imageUploadModal.onOpen}
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        Upload an Image
      </Button>
    </div>
  )
}

export default ImageUpload
