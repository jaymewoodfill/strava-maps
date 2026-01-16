import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const download = await prisma.emailDownload.findUnique({
      where: {
        token: params.token,
      },
      include: {
        route: true,
      },
    })

    if (!download) {
      return NextResponse.json(
        { error: "Invalid or expired download link" },
        { status: 404 }
      )
    }

    if (download.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 410 }
      )
    }

    // Mark as downloaded
    if (!download.downloadedAt) {
      await prisma.emailDownload.update({
        where: {
          id: download.id,
        },
        data: {
          downloadedAt: new Date(),
        },
      })
    }

    // Redirect to GPX file
    return NextResponse.redirect(download.route.gpxFileUrl)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    )
  }
}
