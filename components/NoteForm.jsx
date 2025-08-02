"use client"

import { useState } from "react"

export default function NoteForm({ note, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    content: note?.content || "",
    category: note?.category || "Basics",
  })
  const [loading, setLoading] = useState(false)

  const categories = ["Basics", "Rhythm", "Scales", "Chords", "Harmony"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{note ? "Edit Note" : "Create New Note"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter note title"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            className="input-field"
            placeholder="Enter note content"
          />
        </div>

        <div className="flex space-x-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : note ? "Update Note" : "Create Note"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
