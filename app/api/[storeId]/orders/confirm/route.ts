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

export async function POST(req: Request) {
  try {
    const { orderId, phone, address } = await req.json()

    if (!orderId) {
      return new NextResponse("Order ID is required", {
        status: 400,
        headers: corsHeaders,
      })
    }
    if (!phone) {
      return new NextResponse("Phone is required", {
        status: 400,
        headers: corsHeaders,
      })
    }
    if (!address) {
      return new NextResponse("Address is required", {
        status: 400,
        headers: corsHeaders,
      })
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        address,
        phone,
      },
      include: {
        orderItems: true,
      },
    })

    return NextResponse.json(order, { headers: corsHeaders })
  } catch (error) {
    console.log("[ORDER_CONFIRM_POST]", error)
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    })
  }
}
