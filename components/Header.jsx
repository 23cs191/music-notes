"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in by making a request to verify token
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🎼 Music Theory Notes
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <span className="text-gray-500">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/user/login" className="text-gray-700 hover:text-primary-600">
                  User Login
                </Link>
                <Link href="/admin/login" className="text-gray-700 hover:text-primary-600">
                  Admin Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
