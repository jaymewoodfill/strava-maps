import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Difficulty, AccessType } from '@prisma/client'
import { requireAdmin } from "@/lib/auth/middleware"
import { uploadFile } from "@/lib/s3/upload"

// Create route (Admin only)
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const formData = await request.formData()
    
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const distance = parseFloat(formData.get("distance") as string)
    const elevationGain = parseInt(formData.get("elevationGain") as string)
    const difficulty = formData.get("difficulty") as string
    const location = formData.get("location") as string
    const accessType = formData.get("accessType") as string
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null

    // Runtime-validate enum values
    const difficultyUpper = difficulty?.toUpperCase()
    const accessTypeUpper = accessType?.toUpperCase()
    const validDifficulties = Object.values(Difficulty)
    const validAccessTypes = Object.values(AccessType)

    if (!difficultyUpper || !validDifficulties.includes(difficultyUpper as Difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 })
    }

    if (!accessTypeUpper || !validAccessTypes.includes(accessTypeUpper as AccessType)) {
      return NextResponse.json({ error: "Invalid accessType" }, { status: 400 })
    }

    // Handle file uploads
    const gpxFile = formData.get("gpxFile") as File
    const thumbnailFile = formData.get("thumbnail") as File

    if (!gpxFile || !thumbnailFile) {
      return NextResponse.json(
        { error: "GPX file and thumbnail are required" },
        { status: 400 }
      )
    }

    // Upload files to S3
    const gpxBuffer = Buffer.from(await gpxFile.arrayBuffer())
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())

    const gpxUrl = await uploadFile(gpxBuffer, gpxFile.name, gpxFile.type, "gpx")
    const thumbnailUrl = await uploadFile(
      thumbnailBuffer,
      thumbnailFile.name,
      thumbnailFile.type,
      "images"
    )

    // Create route in database
    const route = await prisma.route.create({
      data: {
        title,
        description,
        distance,
        elevationGain,
        difficulty: difficultyUpper as Difficulty,
        location,
        accessType: accessTypeUpper as AccessType,
        price,
        gpxFileUrl: gpxUrl,
        thumbnailUrl: thumbnailUrl,
        isPublished: true,
      },
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error("Error creating route:", error)
    return NextResponse.json(
      { error: "Failed to create route" },
      { status: 500 }
    )
  }
}

// Get routes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const routes = await prisma.route.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await prisma.route.count({
      where: {
        isPublished: true,
      },
    })

    return NextResponse.json({
      routes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    )
  }
}
