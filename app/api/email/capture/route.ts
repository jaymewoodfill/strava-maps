import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendFreeRouteEmail } from "@/lib/email/client"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, routeId } = await request.json()

    if (!email || !routeId) {
      return NextResponse.json(
        { error: "Email and route ID are required" },
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

    if (route.accessType !== "FREE") {
      return NextResponse.json(
        { error: "This route is not free" },
        { status: 400 }
      )
    }

    // Create or update email subscriber
    await prisma.emailSubscriber.upsert({
      where: { email },
      update: {},
      create: {
        email,
        source: "route_download",
      },
    })

    // Create download token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.emailDownload.create({
      data: {
        email,
        routeId,
        token,
        expiresAt,
      },
    })

    // Send email with download link
    await sendFreeRouteEmail(email, route.title, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error capturing email:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
