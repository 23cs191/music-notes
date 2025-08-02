"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AdminRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/dashboard")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16">
        <div className="card">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Registration</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/admin/login" className="text-primary-600 hover:text-primary-700">
              Login here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
