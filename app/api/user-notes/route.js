import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import UserNote from "@/models/UserNote"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const notes = await UserNote.find({ userId: authUser.userId }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error("Error fetching user notes:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    const note = await UserNote.create({
      userId: authUser.userId,
      title,
      content,
    })

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Error creating user note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
