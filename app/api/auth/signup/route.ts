import { NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth/actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await signUp(formData)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
