import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import SettingsForm from "./components/SettingsForm"

interface SettingsPageProps {
  params: {
    storeId: string
  }
}
const Settings: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex-col">
      <div className="flex- space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
export default Settings
