import { useState } from 'react'
import { apiService } from '../../services/apiService'

const ApiTester = () => {
  const [testResults, setTestResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com', 
    password: 'password123'
  })

  const testAllEndpoints = async () => {
    setIsLoading(true)
    const results = {}

    // Test 1: Backend Connection
    try {
      console.log('🔍 Testing backend connection...')
      const connected = await apiService.testConnection()
      results.connection = connected ? 'Backend Connected ✅' : 'Backend Connection Failed ❌'
    } catch (error) {
      results.connection = `Connection Error: ${error.message} ❌`
    }

    // Test 2: Registration endpoint
    try {
      console.log('📝 Testing registration endpoint...')
      const response = await apiService.register(testData.name, testData.email, testData.password)
      results.register = 'Registration endpoint working ✅'
    } catch (error) {
      results.register = `Registration Error: ${error.message} ❌`
    }

    // Test 3: Sign-in endpoint
    try {
      console.log('🔐 Testing sign-in endpoint...')
      const response = await apiService.signIn(testData.email, testData.password)
      results.signin = 'Sign-in endpoint working ✅'
    } catch (error) {
      results.signin = `Sign-in Error: ${error.message} ❌`
    }

    // Test 4: Items endpoints (requires authentication)
    try {
      console.log('📦 Testing items endpoints...')
      
      // Test getting items
      const items = await apiService.getItems()
      results.getItems = 'Get items endpoint working ✅'
      
      // Test adding item
      const newItem = { name: 'Test Item', category: 'Test Category', completed: false }
      const addedItem = await apiService.addItem(newItem)
      results.addItem = 'Add item endpoint working ✅'
      
      // Test updating item (if item was added successfully)
      if (addedItem && addedItem.id) {
        await apiService.updateItem(addedItem.id, { completed: true })
        results.updateItem = 'Update item endpoint working ✅'
        
        // Test deleting item
        await apiService.deleteItem(addedItem.id)
        results.deleteItem = 'Delete item endpoint working ✅'
      }
    } catch (error) {
      results.itemsEndpoints = `Items endpoints error: ${error.message} ❌`
    }

    // Test 5: Categories endpoints
    try {
      console.log('🏷️ Testing categories endpoints...')
      const categories = await apiService.getCategories()
      results.getCategories = 'Get categories endpoint working ✅'
    } catch (error) {
      results.getCategories = `Get categories error: ${error.message} ❌`
    }

    // Test 6: Password reset endpoints
    try {
      console.log('🔒 Testing password reset endpoints...')
      await apiService.requestPasswordReset('test@example.com')
      results.passwordReset = 'Password reset request endpoint working ✅'
    } catch (error) {
      results.passwordReset = `Password reset error: ${error.message} ❌`
    }

    setTestResults(results)
    setIsLoading(false)
  }

  const testSpecificEndpoint = async () => {
    try {
      console.log('🎯 Testing direct registration call...')
      const response = await fetch('http://localhost:8000/api/login/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      console.log('📡 Raw response status:', response.status)
      console.log('📡 Raw response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.json()
      console.log('📦 Raw response data:', data)
      
      setTestResults(prev => ({
        ...prev,
        directTest: `Direct test: ${response.status} - ${JSON.stringify(data)}`
      }))
    } catch (error) {
      console.error('🔥 Direct test error:', error)
      setTestResults(prev => ({
        ...prev,
        directTest: `Direct test failed: ${error.message}`
      }))
    }
  }

  const clearResults = () => {
    setTestResults({})
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '400px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <h3>🔧 Enhanced API Tester</h3>
      <p><strong>Backend URL:</strong> http://localhost:8000/api</p>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Test Data:</h4>
        <input 
          placeholder="Name" 
          value={testData.name}
          onChange={(e) => setTestData({...testData, name: e.target.value})}
          style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
        />
        <input 
          placeholder="Email" 
          value={testData.email}
          onChange={(e) => setTestData({...testData, email: e.target.value})}
          style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
        />
        <input 
          placeholder="Password" 
          value={testData.password}
          onChange={(e) => setTestData({...testData, password: e.target.value})}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testAllEndpoints} 
          disabled={isLoading}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom: '5px'
          }}
        >
          {isLoading ? 'Testing All...' : 'Test All Endpoints'}
        </button>

        <button 
          onClick={testSpecificEndpoint}
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom: '5px'
          }}
        >
          Direct Test
        </button>

        <button 
          onClick={clearResults}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '5px'
          }}
        >
          Clear Results
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4>Test Results:</h4>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} style={{ 
                marginBottom: '8px', 
                fontFamily: 'monospace', 
                fontSize: '12px',
                padding: '5px',
                backgroundColor: result.includes('✅') ? '#f0fdf4' : '#fef2f2',
                borderRadius: '4px'
              }}>
                <strong>{test}:</strong> {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Debugging Tips:</strong><br/>
        ✅ Green = Working correctly<br/>
        ❌ Red = Needs attention<br/>
        📱 Check browser console (F12) for detailed logs<br/>
        🔧 Make sure backend server is running on port 8000
      </div>
    </div>
  )
}

export default ApiTester 