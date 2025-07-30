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

  const testBackendConnection = async () => {
    setIsLoading(true)
    const results = {}

    // Test basic connection
    try {
      const connected = await apiService.testConnection()
      results.connection = connected ? 'Connected ✅' : 'Connection Failed ❌'
    } catch (error) {
      results.connection = `Connection Error: ${error.message} ❌`
    }

    // Test registration endpoint with detailed logging
    try {
      console.log('🧪 Testing registration with data:', testData)
      const response = await apiService.register(testData.name, testData.email, testData.password)
      console.log('✅ Registration response:', response)
      results.register = 'Register endpoint working ✅'
    } catch (error) {
      console.error('❌ Registration error details:', error)
      results.register = `Register Error: ${error.message} ❌`
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
      minWidth: '350px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <h3>🔧 Backend API Tester</h3>
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
      
      <button 
        onClick={testBackendConnection} 
        disabled={isLoading}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '10px',
          marginRight: '10px'
        }}
      >
        {isLoading ? 'Testing...' : 'Test API Service'}
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
          marginBottom: '15px'
        }}
      >
        Direct Test
      </button>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4>Test Results:</h4>
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} style={{ marginBottom: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
              <strong>{test}:</strong> {result}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Error "couldnt add to database" means:</strong><br/>
        ✅ Frontend → Backend: Working<br/>
        ❌ Backend → MongoDB: Failed<br/>
        Open browser console (F12) for detailed logs
      </div>
    </div>
  )
}

export default ApiTester 