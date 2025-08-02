"use client"

import { useState } from "react"

export default function NoteCard({ note, isBookmarked, onBookmark, showActions = false, onEdit, onDelete }) {
  const [loading, setLoading] = useState(false)

  const handleBookmark = async () => {
    if (loading) return
    setLoading(true)
    try {
      await onBookmark(note._id)
    } finally {
      setLoading(false)
    }
  }

  const categoryColors = {
    Basics: "bg-blue-100 text-blue-800",
    Rhythm: "bg-green-100 text-green-800",
    Scales: "bg-purple-100 text-purple-800",
    Chords: "bg-orange-100 text-orange-800",
    Harmony: "bg-red-100 text-red-800",
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[note.category]}`}>
          {note.category}
        </span>
      </div>

      <div className="text-gray-700 mb-4 line-clamp-3">
        {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {onBookmark && (
            <button
              onClick={handleBookmark}
              disabled={loading}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isBookmarked
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loading ? "..." : isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
          )}
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(note)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Edit
            </button>
            <button onClick={() => onDelete(note._id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
