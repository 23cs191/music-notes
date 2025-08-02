import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Note from "@/models/Note"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const note = await Note.findById(params.id).populate("createdBy", "name")

    if (!note) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
