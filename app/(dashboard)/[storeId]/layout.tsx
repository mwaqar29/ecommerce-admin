import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { storeid: string }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeid,
      userId,
    },
  })

  if (!store) {
    redirect("/")
  }

  return (
    <>
      <div>This will be a navbar</div>
      {children}
    </>
  )
}
