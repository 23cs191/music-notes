// Test MongoDB connection script
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music_theory_app'

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    console.log('📍 MongoDB URI:', MONGODB_URI)
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    console.log('✅ MongoDB connected successfully!')
    console.log('📊 Database name:', mongoose.connection.name)
    console.log('🔗 Connection state:', mongoose.connection.readyState)
    console.log('🏠 Host:', mongoose.connection.host)
    console.log('🔌 Port:', mongoose.connection.port)
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const testDoc = new TestModel({ test: 'Connection test successful' })
    await testDoc.save()
    console.log('✅ Test document created successfully')
    
    await TestModel.deleteOne({ _id: testDoc._id })
    console.log('✅ Test document deleted successfully')
    
    await mongoose.connection.close()
    console.log('✅ Connection closed successfully')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Possible solutions:')
      console.error('1. Make sure MongoDB is installed and running')
      console.error('2. Check if MongoDB service is started')
      console.error('3. Verify the connection string is correct')
      console.error('4. Check if port 27017 is available')
    }
    
    process.exit(1)
  }
}

testConnection()
