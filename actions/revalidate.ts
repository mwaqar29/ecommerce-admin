"use server"

import { revalidatePath } from "next/cache"

/* Server action to revalidate a path, esp. the listing pages
as 'revalidatePath' function function cannot directly be used in client components */
export const revalidate = async (path: string) => {
  revalidatePath(path)
}
