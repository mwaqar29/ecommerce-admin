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
import { Color } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
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
import { revalidate } from "@/actions/revalidate"

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().regex(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "String must be a valid hex code",
  }),
})

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
  initialData: Color | null
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Color" : "Create Color"
  const description = initialData ? "Edit the Color" : "Add a new Color"
  const toastMsg = initialData ? "Color Updated." : "Color Created."
  const action = initialData ? "Save Changes" : "Create"

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  })

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data,
        )
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }
      await revalidate(`/${params.storeId}/colors`)
      router.push(`/${params.storeId}/colors`)
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      await revalidate(`/${params.storeId}/colors`)
      router.push(`/${params.storeId}/colors`)
      toast.success("Color deleted.")
    } catch (error) {
      toast.error("Make sure you remove all products using this color.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

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
            content=<p>Delete Color</p>
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Color Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Enter Color Value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
            onClick={() => router.push(`/${params.storeId}/colors`)}
          >
            Back
          </Button>
        </form>
      </Form>
    </>
  )
}

export default ColorForm
