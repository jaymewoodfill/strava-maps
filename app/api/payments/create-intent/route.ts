import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { createPaymentIntent } from "@/lib/stripe/client"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (session instanceof NextResponse) return session

  try {
    const { routeId } = await request.json()

    if (!routeId) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      )
    }

    // Get route details
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    })

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    if (!route.price || route.accessType === "FREE") {
      return NextResponse.json(
        { error: "This route is free" },
        { status: 400 }
      )
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_routeId: {
          userId: session.user.id,
          routeId: route.id,
        },
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Already purchased" },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(route.price, {
      routeId: route.id,
      userId: session.user.id,
      routeTitle: route.title,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: route.price,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}
