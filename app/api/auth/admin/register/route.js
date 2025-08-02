import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import Admin from "@/models/Admin"
import { generateToken, createAuthResponse } from "@/lib/auth"

export async function POST(request) {
  try {
    await dbConnect()

    const { name, email, password } = await request.json()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Admin already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    })

    // Generate token
    const token = generateToken({
      userId: admin._id,
      email: admin.email,
      role: "admin",
      name: admin.name,
    })

    return createAuthResponse(token)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
