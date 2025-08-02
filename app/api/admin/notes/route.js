import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Note from "@/models/Note"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const notes = await Note.find({}).populate("createdBy", "name").sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error("Error fetching admin notes:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { title, content, category } = await request.json()

    const note = await Note.create({
      title,
      content,
      category,
      createdBy: authUser.userId,
    })

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
