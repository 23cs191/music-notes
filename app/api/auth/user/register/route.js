import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { generateToken, createAuthResponse } from "@/lib/auth"

export async function POST(request) {
  try {
    console.log("Registration attempt started")
    
    // Connect to database
    console.log("Connecting to database...")
    await dbConnect()
    console.log("Database connected successfully")

    // Parse request body
    console.log("Parsing request body...")
    const { name, email, password } = await request.json()
    console.log("Registration attempt for:", { name, email })

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    console.log("Checking if user exists...")
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }
    console.log("User does not exist, proceeding with registration")

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log("Password hashed successfully")

    // Create user
    console.log("Creating user...")
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })
    console.log("User created successfully:", user._id)

    // Generate token
    console.log("Generating JWT token...")
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: "user",
      name: user.name,
    })
    console.log("Token generated successfully")

    console.log("Registration successful for user:", email)
    return createAuthResponse(token)
  } catch (error) {
    console.error("Registration error details:", {
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
