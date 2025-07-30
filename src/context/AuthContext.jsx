import { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start (cookie-based auth)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch user info to verify if cookie-based session is valid
        const userData = localStorage.getItem('userData')
        if (userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.log('No valid session found')
        localStorage.removeItem('userData')
      }
      setIsLoading(false)
    }
    
    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await apiService.signIn(email, password)
      
      console.log('🔐 Login Response:', response)
      
      // Handle different possible response formats (cookies handle token automatically)
      const user = response.user || response.data || response || { 
        name: response.name, 
        email: response.email,
        id: response.id || response._id 
      }
      
      // Store only user data (cookies handle authentication token)
      localStorage.setItem('userData', JSON.stringify(user))
      
      // Set user state
      setUser(user)
      setIsAuthenticated(true)
      
      console.log('✅ Login successful, user:', user)
      return { success: true, user: user }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setIsLoading(true)
      
      // Step 1: Register the user (no token expected)
      console.log('📝 Step 1: Registering user...')
      const registerResponse = await apiService.register(name, email, password)
      console.log('✅ Registration successful:', registerResponse)
      
      // Step 2: Automatically sign in to get the token
      console.log('🔐 Step 2: Signing in to get token...')
      const signInResponse = await apiService.signIn(email, password)
      console.log('✅ Sign-in successful:', signInResponse)
      
      // Handle sign-in response (cookies handle token automatically)
      const user = signInResponse.user || signInResponse.data || signInResponse || { 
        name: signInResponse.name || name, 
        email: signInResponse.email || email,
        id: signInResponse.id || signInResponse._id 
      }
      
      // Store only user data (cookies handle authentication token)
      localStorage.setItem('userData', JSON.stringify(user))
      
      // Set user state
      setUser(user)
      setIsAuthenticated(true)
      
      console.log('✅ Registration and auto-login successful, user:', user)
      return { success: true, user: user }
    } catch (error) {
      console.error('❌ Registration error:', error)
      
      // Handle specific error messages from backend
      let errorMessage = error.message || 'Registration failed'
      
      // Check for common MongoDB errors
      if (errorMessage.includes('couldnt add to database')) {
        errorMessage = 'Email already exists or database error. Please try a different email.'
      } else if (errorMessage.includes('duplicate key') || errorMessage.includes('E11000')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.'
      } else if (errorMessage.includes('validation failed')) {
        errorMessage = 'Please check your input. All fields are required and email must be valid.'
      } else if (errorMessage.includes('HTTP error! status: 400')) {
        // If registration returns 400 but actually succeeded, try sign-in
        try {
          console.log('🔄 Registration might have succeeded with 400 status, trying sign-in...')
          const signInResponse = await apiService.signIn(email, password)
          const user = signInResponse.user || signInResponse.data || signInResponse || { 
            name: signInResponse.name || name, 
            email: signInResponse.email || email,
            id: signInResponse.id || signInResponse._id 
          }
          
          // Store user data (cookies handle authentication token)
          localStorage.setItem('userData', JSON.stringify(user))
          setUser(user)
          setIsAuthenticated(true)
          return { success: true, user: user }
        } catch (signInError) {
          console.error('Sign-in after registration also failed:', signInError)
        }
        errorMessage = 'Registration completed but login failed. Please try signing in manually.'
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state (cookies cleared by backend)
      localStorage.removeItem('userData')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      setIsLoading(true)
      await apiService.requestPasswordReset(email)
      return { success: true }
    } catch (error) {
      console.error('Password reset request error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setIsLoading(true)
      await apiService.resetPassword(token, newPassword)
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 