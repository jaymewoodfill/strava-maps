import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const route = await prisma.route.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    return NextResponse.json(route)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch route" },
      { status: 500 }
    )
  }
}
