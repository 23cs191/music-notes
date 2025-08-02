import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { generateToken, createAuthResponse } from "@/lib/auth"

export async function POST(request) {
  try {
    console.log("Login attempt started")
    
    // Connect to database
    console.log("Connecting to database...")
    await dbConnect()
    console.log("Database connected successfully")

    // Parse request body
    console.log("Parsing request body...")
    const { email, password } = await request.json()
    console.log("Login attempt for email:", email)

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    console.log("Searching for user...")
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found for email:", email)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
    console.log("User found:", user.name)

    // Check password
    console.log("Verifying password...")
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
    console.log("Password verified successfully")

    // Generate token
    console.log("Generating JWT token...")
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: "user",
      name: user.name,
    })
    console.log("Token generated successfully")

    console.log("Login successful for user:", email)
    return createAuthResponse(token)
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Return more specific error messages in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    const errorMessage = isDevelopment ? error.message : "Internal server error"
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage,
      ...(isDevelopment && { error: error.name, details: error.message })
    }, { status: 500 })
  }
}
