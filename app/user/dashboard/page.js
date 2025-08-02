"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import NoteCard from "@/components/NoteCard"
import BookmarkList from "@/components/BookmarkList"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("notes")
  const [notes, setNotes] = useState([])
  const [userNotes, setUserNotes] = useState([])
  const [bookmarkedNotes, setBookmarkedNotes] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [noteFormData, setNoteFormData] = useState({ title: "", content: "" })

  const categories = ["All", "Basics", "Rhythm", "Scales", "Chords", "Harmony"]

  useEffect(() => {
    fetchNotes()
    fetchUserNotes()
    fetchBookmarks()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const fetchUserNotes = async () => {
    try {
      const response = await fetch("/api/user-notes")
      const data = await response.json()
      if (data.success) {
        setUserNotes(data.notes)
      }
    } catch (error) {
      console.error("Error fetching user notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks")
      const data = await response.json()
      if (data.success) {
        const bookmarkIds = new Set(data.bookmarks.map((note) => note._id))
        setBookmarkedNotes(bookmarkIds)
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }

  const handleBookmark = async (noteId) => {
    try {
      const isBookmarked = bookmarkedNotes.has(noteId)
      const method = isBookmarked ? "DELETE" : "POST"

      const response = await fetch("/api/bookmarks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      })

      if (response.ok) {
        const newBookmarks = new Set(bookmarkedNotes)
        if (isBookmarked) {
          newBookmarks.delete(noteId)
        } else {
          newBookmarks.add(noteId)
        }
        setBookmarkedNotes(newBookmarks)
      }
    } catch (error) {
      console.error("Error handling bookmark:", error)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteFormData),
      })

      if (response.ok) {
        fetchUserNotes()
        setShowNoteForm(false)
        setNoteFormData({ title: "", content: "" })
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const handleEditNote = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/user-notes/${editingNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteFormData),
      })

      if (response.ok) {
        fetchUserNotes()
        setEditingNote(null)
        setNoteFormData({ title: "", content: "" })
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(`/api/user-notes/${noteId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchUserNotes()
        }
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    }
  }

  const startEditNote = (note) => {
    setEditingNote(note)
    setNoteFormData({ title: note.title, content: note.content })
  }

  const filteredNotes = selectedCategory === "All" ? notes : notes.filter((note) => note.category === selectedCategory)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Explore music theory notes and manage your learning</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "notes", label: "All Notes" },
              { id: "bookmarks", label: "Bookmarks" },
              { id: "personal", label: "My Notes" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* All Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Notes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  isBookmarked={bookmarkedNotes.has(note._id)}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && <BookmarkList />}

        {/* Personal Notes Tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Personal Notes</h2>
              <button onClick={() => setShowNoteForm(true)} className="btn-primary">
                Add New Note
              </button>
            </div>

            {/* Note Form */}
            {(showNoteForm || editingNote) && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{editingNote ? "Edit Note" : "Create New Note"}</h3>
                <form onSubmit={editingNote ? handleEditNote : handleCreateNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={noteFormData.title}
                      onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                      required
                      className="input-field"
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={noteFormData.content}
                      onChange={(e) => setNoteFormData({ ...noteFormData, content: e.target.value })}
                      required
                      rows={6}
                      className="input-field"
                      placeholder="Enter note content"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingNote ? "Update Note" : "Create Note"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNoteForm(false)
                        setEditingNote(null)
                        setNoteFormData({ title: "", content: "" })
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* User Notes List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userNotes.map((note) => (
                <div key={note._id} className="card">
                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-700 mb-4">{note.content}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditNote(note)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {userNotes.length === 0 && !showNoteForm && (
              <div className="text-center py-8">
                <p className="text-gray-500">No personal notes yet. Create your first note!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
