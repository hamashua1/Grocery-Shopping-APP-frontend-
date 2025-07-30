import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './Auth.css'

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { requestPasswordReset, isLoading } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    const result = await requestPasswordReset(email)
    if (result.success) {
      setSuccess('Password reset instructions have been sent to your email!')
      showSuccess('Password reset email sent successfully! 📧')
      setIsSubmitted(true)
    } else {
      setError(result.error)
      showError(`Reset failed: ${result.error}`)
    }
  }

  if (isSubmitted) {
    return (
      <div className="auth-form-container">
        <div className="auth-header">
          <div className="auth-icon success">
            <span>✅</span>
          </div>
          <h2>Check Your Email!</h2>
          <p>We've sent password reset instructions to {email}</p>
        </div>

        <div className="success-message">
          <p>Please check your email and follow the instructions to reset your password.</p>
          <p>If you don't see the email, check your spam folder.</p>
        </div>

        <button
          type="button"
          className="auth-button secondary"
          onClick={onBackToLogin}
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <div className="auth-icon">
          <span>🔑</span>
        </div>
        <h2>Forgot Password?</h2>
        <p>Enter your email to receive reset instructions</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            'Send Reset Instructions'
          )}
        </button>

        <div className="auth-divider">
          <span>Remember your password?</span>
        </div>

        <button
          type="button"
          className="auth-button secondary"
          onClick={onBackToLogin}
          disabled={isLoading}
        >
          Back to Sign In
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword 