import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth/actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await signIn(formData)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
