// Test authentication endpoints directly
async function testAuth() {
  const baseUrl = 'http://localhost:3001'
  
  console.log('🧪 Testing Authentication Endpoints\n')
  
  // Test data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123'
  }
  
  try {
    // Test Registration
    console.log('📝 Testing Registration...')
    const registerResponse = await fetch(`${baseUrl}/api/auth/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    const registerData = await registerResponse.json()
    console.log('Register Status:', registerResponse.status)
    console.log('Register Response:', registerData)
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful')
    } else {
      console.log('❌ Registration failed')
    }
    
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Test Login
    console.log('🔐 Testing Login...')
    const loginResponse = await fetch(`${baseUrl}/api/auth/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('Login Status:', loginResponse.status)
    console.log('Login Response:', loginData)
    
    if (loginResponse.ok) {
      console.log('✅ Login successful')
    } else {
      console.log('❌ Login failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Wait a moment for server to be ready, then test
setTimeout(testAuth, 1000)
