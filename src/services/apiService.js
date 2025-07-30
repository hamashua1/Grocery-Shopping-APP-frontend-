const API_BASE_URL = 'http://localhost:8000/api' // Updated to match your backend URL

class ApiService {
  constructor() {
    // Token management handled by cookies
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include', // Enable cookies for authentication
      ...options,
    }

    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    })

    try {
      const response = await fetch(url, config)
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      const isJson = contentType && contentType.includes('application/json')

      if (!response.ok) {
        let errorData = {}
        if (isJson) {
          errorData = await response.json().catch(() => ({}))
        } else {
          const text = await response.text()
          errorData = { message: text || `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('❌ API Error:', errorData)
        
        // Special handling for registration endpoint returning 400 but with success message
        if (endpoint === '/login/register' && response.status === 400 && errorData.message && errorData.message.includes('info added to database')) {
          console.log('⚠️ Registration returned 400 but seems successful, treating as success')
          return errorData // Return the success response even though status is 400
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = isJson ? await response.json() : await response.text()
      console.log('✅ API Success:', data)
      return data
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 Network Error - CORS or Connection issue with http://localhost:8000')
        throw new Error('Cannot connect to backend server. Check CORS settings or if backend is running.')
      }
      console.error('🔥 API Request Failed:', error)
      throw error
    }
  }

  // Test connection to backend
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      })
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }

  // Authentication endpoints
  async register(name, email, password) {
    return this.request('/login/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  }

  async signIn(email, password) {
    return this.request('/login/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    })
  }

  async requestPasswordReset(email) {
    return this.request('/api/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token, newPassword) {
    return this.request(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    })
  }

  // Items endpoints
  async getItems() {
    return this.request('/items')
  }

  async addItem(item) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    })
  }

  async deleteItem(itemId) {
    return this.request(`/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async deleteItemsByCategory(categoryId) {
    return this.request(`/items/category/${categoryId}`, {
      method: 'DELETE',
    })
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories')
  }

  async getCategoryItems(category) {
    return this.request(`/category/${category}`)
  }
}

export const apiService = new ApiService() 