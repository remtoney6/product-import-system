# React Frontend – Product Import System

This is the frontend application for the Product Import System, built using React. It interacts with a Laravel backend API to provide user registration, login, product CSV import, and listing functionality.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Laravel backend running at `http://localhost:8000`

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables
Create a .env file inside the frontend/ directory:

```bash
REACT_APP_API_URL=http://localhost:8000/api
```

### 4. Run the development server

```bash
npm start
```
The app will be available at http://localhost:3000.

### Folder Structure
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── ProductImport.jsx
│   │   └── ProductList.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── HomePage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── index.js
├── .env
└── package.json

