import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } },
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size Id is required", { status: 400 })
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse("Size Id is required", { status: 400 })
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

    const size = await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse("Size Id is required", { status: 400 })
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

    const size = await prisma.size.delete({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
