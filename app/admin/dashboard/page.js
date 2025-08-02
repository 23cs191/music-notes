"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import NoteForm from "@/components/NoteForm"
import NoteCard from "@/components/NoteCard"

export default function AdminDashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Basics", "Rhythm", "Scales", "Chords", "Harmony"]

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/admin/notes")
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (formData) => {
    try {
      const response = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchNotes()
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const handleUpdateNote = async (formData) => {
    try {
      const response = await fetch(`/api/admin/notes/${editingNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchNotes()
        setEditingNote(null)
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(`/api/admin/notes/${noteId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchNotes()
        }
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    }
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setShowForm(false)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage music theory notes and content</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingNote(null)
            }}
            className="btn-primary"
          >
            Create New Note
          </button>
        </div>

        {/* Note Form */}
        {(showForm || editingNote) && (
          <NoteForm
            note={editingNote}
            onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
            onCancel={() => {
              setShowForm(false)
              setEditingNote(null)
            }}
          />
        )}

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
              showActions={true}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedCategory === "All"
                ? "No notes created yet. Create your first note!"
                : `No notes in ${selectedCategory} category yet.`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
