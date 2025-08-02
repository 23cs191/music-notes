import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/music_theory_app"

console.log("MongoDB URI:", MONGODB_URI ? "Set" : "Not set")
console.log("Environment:", process.env.NODE_ENV || "development")

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  try {
    // Check if already connected
    if (cached.conn && mongoose.connection.readyState === 1) {
      console.log("Using existing MongoDB connection")
      return cached.conn
    }

    // If connection exists but not ready, wait for it
    if (cached.promise) {
      console.log("Waiting for existing MongoDB connection promise")
      cached.conn = await cached.promise
      return cached.conn
    }

    console.log("Creating new MongoDB connection...")
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
    
    cached.conn = await cached.promise
    
    console.log("MongoDB connected successfully")
    console.log("Database:", mongoose.connection.name)
    console.log("Connection state:", mongoose.connection.readyState)
    
    return cached.conn
    
  } catch (error) {
    console.error("MongoDB connection error:", error)
    cached.promise = null
    cached.conn = null
    
    // Provide more specific error messages
    if (error.name === 'MongoServerSelectionError') {
      throw new Error(`Cannot connect to MongoDB. Please ensure MongoDB is running on ${MONGODB_URI}`)
    } else if (error.name === 'MongoParseError') {
      throw new Error(`Invalid MongoDB URI: ${MONGODB_URI}`)
    } else {
      throw new Error(`Database connection failed: ${error.message}`)
    }
  }
}

export default dbConnect
