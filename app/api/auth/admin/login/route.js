import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import Admin from "@/models/Admin"
import { generateToken, createAuthResponse } from "@/lib/auth"

export async function POST(request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Find admin
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const token = generateToken({
      userId: admin._id,
      email: admin.email,
      role: "admin",
      name: admin.name,
    })

    return createAuthResponse(token)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
