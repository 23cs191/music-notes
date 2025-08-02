import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
