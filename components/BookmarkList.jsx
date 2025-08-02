"use client"

import { useState, useEffect } from "react"
import NoteCard from "./NoteCard"

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks")
      const data = await response.json()
      if (data.success) {
        setBookmarks(data.bookmarks)
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (noteId) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      })

      if (response.ok) {
        setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== noteId))
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bookmarks yet. Start bookmarking notes to see them here!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Bookmarks</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((note) => (
          <NoteCard key={note._id} note={note} isBookmarked={true} onBookmark={handleRemoveBookmark} />
        ))}
      </div>
    </div>
  )
}
