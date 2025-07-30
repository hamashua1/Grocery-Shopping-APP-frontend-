import { useState, useEffect } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'
import { apiService } from './services/apiService'
import AuthContainer from './components/Auth/AuthContainer'
import ToastContainer from './components/Toast/ToastContainer'

function App() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const { showSuccess, showInfo, showError } = useToast()
  const [items, setItems] = useState([])
  const [newItemName, setNewItemName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Predefined categories - you can modify these or fetch from your backend
  const categories = [
    'Fruits',
    'Vegetables',
    'Meat',
    'Drinks'
  ]

  // Fetch items from backend
  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getItems()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  // Add new item
  const addItem = async () => {
    if (!newItemName.trim() || !selectedCategory) {
      showError('Please enter an item name and select a category')
      return
    }

    const newItem = {
      name: newItemName.trim(),
      category: selectedCategory,
      completed: false
    }

    try {
      setIsLoading(true)
      const savedItem = await apiService.addItem(newItem)
      setItems(prevItems => [...prevItems, savedItem])
      setNewItemName('')
      setSelectedCategory('')
      showSuccess(`"${savedItem.name}" added to your list! ✅`)
    } catch (error) {
      console.error('Error adding item:', error)
      showError('Failed to add item. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle item completion
  const toggleItem = async (itemId) => {
    try {
      const itemToUpdate = items.find(item => item.id === itemId)
      if (!itemToUpdate) return

      // Optimistically update UI
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
      setItems(updatedItems)

      // Note: Your backend might need a PATCH endpoint for updating items
      // For now, we'll just update the local state
      // If you want to persist completion status, add a PATCH endpoint to your backend
    } catch (error) {
      console.error('Error updating item:', error)
      // Revert optimistic update on error
      fetchItems()
    }
  }

  // Delete item
  const deleteItem = async (itemId) => {
    const itemToDelete = items.find(item => item.id === itemId)
    try {
      setIsLoading(true)
      await apiService.deleteItem(itemId)
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
      if (itemToDelete) {
        showSuccess(`"${itemToDelete.name}" removed from your list! 🗑️`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      showError('Failed to delete item. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout()
      showInfo('You have been logged out successfully! 👋')
    }
  }

  // Filter items based on selected category
  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category === filterCategory)

  // Load items on component mount (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems()
    }
  }, [isAuthenticated])

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <AuthContainer />
      </>
    )
  }

  return (
    <>
      <ToastContainer />
      <div className="app">
        <div className="app-content">
        <header className="app-header">
          <div className="header-content">
            <h1>Groceries Shopping App</h1>
            <div className="user-info">
              <span>Welcome, {user?.name}! 👋</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
        {/* Add Item Section */}
        <section className="add-item-section">
          <div className="input-group">
            <input
              type="text"
              placeholder="Add a grocery item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              disabled={isLoading}
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button 
              onClick={addItem}
              disabled={isLoading || !newItemName.trim() || !selectedCategory}
            >
              Add Item
            </button>
          </div>
        </section>

        {/* Filter and Actions Section */}
        <section className="filter-section">
          <div className="filter-group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Filter Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button onClick={() => setFilterCategory('all')}>
              Show All Items
            </button>
          </div>
        </section>

        {/* Items List Section */}
        <section className="items-section">
          {isLoading && <div className="loading">Loading...</div>}
          
          {!isLoading && filteredItems.length === 0 && (
            <div className="empty-state">
              <p>No items found. Add some groceries to get started!</p>
            </div>
          )}

          {!isLoading && filteredItems.length > 0 && (
            <div className="items-grid">
              {filteredItems.map(item => (
                <div key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
                  <div className="item-content">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      className={`toggle-btn ${item.completed ? 'completed' : 'pending'}`}
                      onClick={() => toggleItem(item.id)}
                      title={item.completed ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {item.completed ? '✓' : '○'}
                    </button>
                    
                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item.id)}
                      title="Delete item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Summary Section */}
        {items.length > 0 && (
          <section className="summary-section">
            <div className="summary-stats">
              <span>Total: {items.length}</span>
              <span>Completed: {items.filter(item => item.completed).length}</span>
              <span>Pending: {items.filter(item => !item.completed).length}</span>
            </div>
          </section>
        )}
        </main>
      </div>
      
      <div className="app-illustration">
        <div className="grocery-scene">
          <div className="shopping-bag">
            <div className="bag-body"></div>
            <div className="bag-handles">
              <div className="handle left"></div>
              <div className="handle right"></div>
            </div>
          </div>
          
          <div className="floating-groceries">
            <div className="grocery-item apple">🍎</div>
            <div className="grocery-item banana">🍌</div>
            <div className="grocery-item carrot">🥕</div>
            <div className="grocery-item tomato">🍅</div>
            <div className="grocery-item broccoli">🥦</div>
            <div className="grocery-item orange">🍊</div>
            <div className="grocery-item lettuce">🥬</div>
            <div className="grocery-item pepper">🫑</div>
            <div className="grocery-item grapes">🍇</div>
          </div>
          
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-header">
                <div className="signal-bars"></div>
                <div className="time">12:30</div>
                <div className="battery"></div>
              </div>
              <div className="app-preview">
                <div className="app-title">Grocery App</div>
                <div className="preview-items">
                  <div className="preview-item">🛒 Fresh Items</div>
                  <div className="preview-item">📱 Easy Shopping</div>
                  <div className="preview-item">🚚 Quick Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="illustration-text">
          <h3>Fresh Groceries! 🥬</h3>
          <p>Shop smart, eat fresh</p>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
