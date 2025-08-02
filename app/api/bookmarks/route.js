import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(authUser.userId).populate("bookmarks")

    return NextResponse.json({
      success: true,
      bookmarks: user.bookmarks || [],
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
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

    const { noteId } = await request.json()

    await User.findByIdAndUpdate(authUser.userId, { $addToSet: { bookmarks: noteId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding bookmark:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await dbConnect()

    const authUser = await getAuthUser()
    if (!authUser || authUser.role !== "user") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { noteId } = await request.json()

    await User.findByIdAndUpdate(authUser.userId, { $pull: { bookmarks: noteId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
