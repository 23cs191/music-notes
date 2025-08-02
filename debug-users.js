// Debug script to check users in database
import mongoose from 'mongoose'
import User from './models/User.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music_theory_app'

async function debugUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    
    console.log('📊 Checking users in database...')
    const users = await User.find({})
    
    console.log(`Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`)
      console.log('  ID:', user._id)
      console.log('  Name:', user.name)
      console.log('  Email:', user.email)
      console.log('  Password hash length:', user.password ? user.password.length : 'NO PASSWORD')
      console.log('  Password starts with:', user.password ? user.password.substring(0, 10) + '...' : 'N/A')
      console.log('  Created:', user.createdAt)
    })
    
    if (users.length === 0) {
      console.log('❌ No users found in database')
    }
    
    await mongoose.connection.close()
    console.log('✅ Connection closed')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

debugUsers()
