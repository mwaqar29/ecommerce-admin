import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  console.log(corsHeaders)
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string
    }
  },
) {
  try {
    const { productIds } = await req.json()

    console.log(productIds)
    if (!productIds?.length) {
      return new NextResponse("Products are required", {
        status: 400,
        headers: corsHeaders,
      })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
        headers: corsHeaders,
      })
    }

    const order = await prisma.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    })

    return NextResponse.json(order, { headers: corsHeaders })
  } catch (error) {
    console.log("[CHECKOUT_POST]", error)
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    })
  }
}
