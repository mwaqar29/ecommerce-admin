"use client"

import { Separator } from "@/components/ui/separator"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Billboard } from "@prisma/client"
import { Trash } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/AlertModal"
import TooltipComponent from "@/components/ui/tooltip-component"
import ImageUpload from "@/components/ui/image-upload"
import { useImageUploadModal } from "@/hooks/useImageUploadModal"

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1, "Image is required"),
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { imageUrls, setImageUrls, setMaxFiles, setNote } =
    useImageUploadModal()
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Billboard" : "Create Billboard"
  const description = initialData ? "Edit the Billboard" : "Add a new billboard"
  const toastMsg = initialData ? "Billboard Updated." : "Billboard Created."
  const action = initialData ? "Save Changes" : "Create"

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  })

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data,
        )
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMsg)
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      )
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success("Billboard deleted.")
    } catch (error) {
      toast.error("Make sure you remove all categories using this billboard.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  useEffect(() => {
    setMaxFiles(1)
    setNote("Only 1 image is allowed. Max file size limit: 5MB.")
    if (initialData) setImageUrls([initialData.imageUrl])
    else setImageUrls([])
  }, [initialData, setImageUrls, setMaxFiles, setNote])

  useEffect(() => {
    form.setValue("imageUrl", imageUrls[0])
  }, [form, imageUrls])

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <TooltipComponent
            content=<p>Delete Billboard</p>
            trigger=<Button
              variant="destructive"
              size="icon"
              disabled={loading}
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ></TooltipComponent>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Billboard Label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="ml-auto mr-5">
            {action}
          </Button>
          <Button
            type="button"
            disabled={loading}
            className="ml-auto"
            variant="outline"
            onClick={() => router.push(`/${params.storeId}/billboards`)}
          >
            Back
          </Button>
        </form>
      </Form>
    </>
  )
}

export default BillboardForm
