import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './Auth.css'

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, isLoading } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return false
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      showError(error)
      return
    }

    console.log('🔄 Starting registration process...')
    const result = await register(formData.name, formData.email, formData.password)
    
    console.log('🔍 Registration result:', result)
    
    if (result.success) {
      console.log('✅ Registration successful, showing success toast')
      const userName = result.user?.name || formData.name
      showSuccess(`Welcome, ${userName}! Account created successfully! 🎉`)
      setError('')
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    } else {
      console.log('❌ Registration failed, showing error toast')
      const errorMsg = result.error || 'Registration failed'
      setError(errorMsg)
      showError(`Registration failed: ${errorMsg}`)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <div className="auth-icon">
          <span>🎉</span>
        </div>
        <h2>Join Us!</h2>
        <p>Create your account to start shopping</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
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

        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">🔐</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-button primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <button
          type="button"
          className="auth-button secondary"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

export default Register 