import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Note from "@/models/Note"

export async function GET() {
  try {
    await dbConnect()

    const notes = await Note.find({}).populate("createdBy", "name").sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
