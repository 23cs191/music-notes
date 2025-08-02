# 🎼 Music Theory Notes - Full Stack App

A comprehensive full-stack application for learning and managing music theory notes, built with Next.js, MongoDB, and JWT authentication.

## Features

### For Students (Users)
- Browse categorized music theory notes (Basics, Rhythm, Scales, Chords, Harmony)
- Bookmark favorite notes for quick access
- Create, edit, and delete personal notes
- Responsive design for all devices

### For Educators (Admins)
- Create, edit, and delete music theory notes
- Manage content across all categories
- Admin dashboard with full content management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with httpOnly cookies
- **Styling**: Tailwind CSS
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally on `mongodb://localhost:27017`

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd music-theory-notes
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/music_notes
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
/app
  /user
    /dashboard      # User dashboard
    /login          # User login
    /register       # User registration
  /admin
    /dashboard      # Admin dashboard
    /login          # Admin login
    /register       # Admin registration
  /api
    /auth           # Authentication routes
    /notes          # Public notes API
    /bookmarks      # User bookmarks API
    /user-notes     # Personal notes API
    /admin          # Admin management API
/components         # Reusable React components
/lib               # Utility functions and database connection
/models            # MongoDB/Mongoose models
\`\`\`

## API Routes

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/admin/register` - Admin registration
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify authentication
- `POST /api/auth/logout` - Logout

### Notes
- `GET /api/notes` - Get all published notes
- `GET /api/notes/[id]` - Get single note

### User Features
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks` - Remove bookmark
- `GET /api/user-notes` - Get personal notes
- `POST /api/user-notes` - Create personal note
- `PUT /api/user-notes/[id]` - Update personal note
- `DELETE /api/user-notes/[id]` - Delete personal note

### Admin Features
- `GET /api/admin/notes` - Get all notes (admin view)
- `POST /api/admin/notes` - Create new note
- `PUT /api/admin/notes/[id]` - Update note
- `DELETE /api/admin/notes/[id]` - Delete note

## Database Models

### User
- name, email, password
- bookmarks (array of Note IDs)

### Admin
- name, email, password

### Note
- title, content, category
- createdBy (Admin ID)

### UserNote
- userId, title, content

## Authentication & Security

- JWT tokens stored in httpOnly cookies
- Passwords hashed with bcryptjs
- Route protection via middleware
- Role-based access control

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new API routes in `/app/api`
2. Add corresponding components in `/components`
3. Update models in `/models` if needed
4. Add new pages in `/app` following the existing structure

## Deployment

1. Set up MongoDB database (MongoDB Atlas recommended)
2. Update `MONGODB_URI` in environment variables
3. Set a secure `JWT_SECRET`
4. Deploy to Vercel, Netlify, or your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
