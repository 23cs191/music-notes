import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key"

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const decoded = verifyToken(token)
    return decoded
  } catch (error) {
    return null
  }
}

export function createAuthResponse(token) {
  const response = NextResponse.json({ success: true }, { status: 200 })

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}
