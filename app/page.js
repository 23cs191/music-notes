import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">🎼 Music Theory Notes</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Master music theory with our comprehensive collection of organized notes. Learn about basics, rhythm,
            scales, chords, and harmony at your own pace.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <h2 className="text-2xl font-semibold mb-4">For Students</h2>
              <p className="text-gray-600 mb-6">
                Access curated music theory notes, bookmark your favorites, and create personal notes.
              </p>
              <div className="space-y-3">
                <Link href="/user/login" className="btn-primary block">
                  Login as Student
                </Link>
                <Link href="/user/register" className="btn-secondary block">
                  Register as Student
                </Link>
              </div>
            </div>

            <div className="card text-center">
              <h2 className="text-2xl font-semibold mb-4">For Educators</h2>
              <p className="text-gray-600 mb-6">Create, edit, and manage music theory notes across all categories.</p>
              <div className="space-y-3">
                <Link href="/admin/login" className="btn-primary block">
                  Login as Admin
                </Link>
                <Link href="/admin/register" className="btn-secondary block">
                  Register as Admin
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-8">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["Basics", "Rhythm", "Scales", "Chords", "Harmony"].map((category) => (
                <div key={category} className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
