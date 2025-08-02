import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import UserNote from "@/models/UserNote"
import { getAuthUser } from "@/lib/auth"

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    const note = await UserNote.findOneAndUpdate(
      { _id: params.id, userId: authUser.userId },
      { title, content },
      { new: true },
    )

    if (!note) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Error updating user note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const note = await UserNote.findOneAndDelete({
      _id: params.id,
      userId: authUser.userId,
    })

    if (!note) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
