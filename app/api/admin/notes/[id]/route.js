import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Note from "@/models/Note"
import { getAuthUser } from "@/lib/auth"

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { title, content, category } = await request.json()

    const note = await Note.findByIdAndUpdate(params.id, { title, content, category }, { new: true })

    if (!note) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const note = await Note.findByIdAndDelete(params.id)

    if (!note) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
