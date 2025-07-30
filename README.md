# Groceries Shopping App - Frontend
<img width="1068" height="537" alt="image" src="https://github.com/user-attachments/assets/f0ef5e2e-7fda-4c0f-be8f-a33a53b7bdf5" />

A modern, responsive grocery shopping list application built with React and Vite. This frontend is designed to work with a separate backend API for data persistence.

## Features

✅ **Add Items**: Add grocery items with categories  
✅ **Categorization**: Organize items by predefined categories  
✅ **Filter & Search**: Filter items by category  
✅ **Mark Complete**: Toggle items as completed/pending  
✅ **Delete Items**: Remove items from the list  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
✅ **Real-time Updates**: Immediate UI updates with loading states  
✅ **Local Storage Fallback**: Works offline until backend is connected

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Local Storage** - Temporary data persistence (until backend integration)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd grocery-shopping-app-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

The frontend is ready for backend integration. Update the `API_BASE_URL` in `src/App.jsx` to point to your backend server.

### Required API Endpoints

The frontend expects the following REST API endpoints:

#### Items Endpoints

**GET** `/api/items`
- **Description**: Fetch all grocery items
- **Response**: Array of item objects
```json
[
  {
    "id": "string|number",
    "name": "string",
    "category": "string",
    "completed": "boolean",
    "createdAt": "ISO date string"
  }
]
```

**POST** `/api/items`
- **Description**: Create a new grocery item
- **Request Body**:
```json
{
  "name": "string",
  "category": "string",
  "completed": "boolean (optional, defaults to false)"
}
```
- **Response**: Created item object

**PATCH** `/api/items/:id`
- **Description**: Update an existing item (primarily for toggling completion)
- **Request Body**:
```json
{
  "completed": "boolean"
}
```
- **Response**: Updated item object

**DELETE** `/api/items/:id`
- **Description**: Delete an item
- **Response**: Success message or status code

#### Categories (Optional Enhancement)

**GET** `/api/categories`
- **Description**: Fetch available categories
- **Response**: Array of category strings
```json
[
  "Fruits",
  "Vegetables", 
  "Meat",
  "Drinks"
]
```

## Data Model

### Item Object Structure
```javascript
{
  id: string|number,        // Unique identifier
  name: string,             // Item name (e.g., "Bananas")
  category: string,         // Category name
  completed: boolean,       // Whether item is completed
  createdAt: string         // ISO date string
}
```

### Predefined Categories
- Fruits
- Vegetables
- Meat
- Drinks

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # React app entry point
└── index.css        # Global styles

public/
├── index.html       # HTML template
└── vite.svg         # Vite logo
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory for configuration:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Update `src/App.jsx` to use the environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
```

## Deployment

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Simple deployment with GitHub integration  
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3**: Static website hosting
- **Any static hosting service**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Backend Development Notes

When implementing your backend, consider:

1. **Database Schema**: Design tables for items and optionally categories
2. **Validation**: Validate item names, categories, and required fields
3. **Error Handling**: Return appropriate HTTP status codes and error messages
4. **CORS**: Configure CORS to allow requests from your frontend domain
5. **Authentication** (Future): Consider user accounts and private lists
6. **Real-time Updates** (Future): WebSocket support for collaborative lists

## Future Enhancements

- [ ] User authentication and private lists
- [ ] Shared shopping lists
- [ ] Barcode scanning
- [ ] Price tracking
- [ ] Store locations and mapping
- [ ] Recipe integration
- [ ] Dark mode theme
- [ ] Offline support with service workers
- [ ] Push notifications
- [ ] Shopping history and analytics 
