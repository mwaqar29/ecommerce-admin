import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 })
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { label, imageUrl } = body

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 })
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 })
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized operation!", { status: 403 })
    }

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 })
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 })
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized operation!", { status: 403 })
    }

    const billboard = await prisma.billboard.delete({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
