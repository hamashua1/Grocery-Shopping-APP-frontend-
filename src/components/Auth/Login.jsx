import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './Auth.css'

const Login = ({ onToggleMode, onForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      const errorMsg = 'Please fill in all fields'
      setError(errorMsg)
      showError(errorMsg)
      return
    }

    console.log('🔄 Starting login process...')
    const result = await login(email, password)
    
    console.log('🔍 Login result:', result)
    
    if (result.success) {
      console.log('✅ Login successful, showing success toast')
      const userName = result.user?.name || result.user?.email || 'User'
      showSuccess(`Welcome back, ${userName}! Redirecting to your grocery app... 🎉`, 2000)
      setError('')
      // Clear form
      setEmail('')
      setPassword('')
    } else {
      console.log('❌ Login failed, showing error toast')
      const errorMsg = result.error || 'Login failed'
      setError(errorMsg)
      showError(`Login failed: ${errorMsg}`)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <div className="auth-icon">
          <span>🛒</span>
        </div>
        <h2>Welcome Back!</h2>
        <p>Sign in to continue shopping</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="forgot-password-link"
          onClick={onForgotPassword}
          disabled={isLoading}
        >
          Forgot your password?
        </button>

        <button
          type="submit"
          className="auth-button primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        <button
          type="button"
          className="auth-button secondary"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default Login 