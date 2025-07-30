import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import './Auth.css'

const AuthContainer = () => {
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgot'

  const handleToggleMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login')
  }

  const handleForgotPassword = () => {
    setAuthMode('forgot')
  }

  const handleBackToLogin = () => {
    setAuthMode('login')
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-items">
          <div className="floating-item item-1">🍎</div>
          <div className="floating-item item-2">🥕</div>
          <div className="floating-item item-3">🍌</div>
          <div className="floating-item item-4">🥬</div>
          <div className="floating-item item-5">🍅</div>
          <div className="floating-item item-6">🥦</div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          {authMode === 'login' && (
            <Login 
              onToggleMode={handleToggleMode}
              onForgotPassword={handleForgotPassword}
            />
          )}
          
          {authMode === 'register' && (
            <Register onToggleMode={handleToggleMode} />
          )}
          
          {authMode === 'forgot' && (
            <ForgotPassword onBackToLogin={handleBackToLogin} />
          )}
        </div>

        <div className="auth-footer">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}

export default AuthContainer 