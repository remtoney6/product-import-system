# Laravel Backend – Product Import System

This is the backend application for the Product Import System, built using Laravel. It provides the APIs for user registration, login, product CSV import, and listing functionality, which the React frontend interacts with.

## Getting Started

### Prerequisites

- PHP (v8.2 or later)
- Composer
- MySQL or another compatible database
- Laravel 8 or later
- Node.js (v18 or later) for the frontend
- Git

## Setup 

### 1. Clone the repository

```bash
git clone https://github.com/remtoney6/product-import-system.git
```

### 2. Navigate to the project directory

```bash
cd product-import-system-backend
```


### 3. Install dependencies

```bash
composer install
```


### 4. Configure environment variables
Create a .env file in the root of your Laravel project and update the database and other configurations:
```bash
cp .env.example .env
```

Edit the .env file to match your local database configuration:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=product_import_system
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Generate the application key
```bash
php artisan key:generate
```

### 6. Run Database Migrations and Seeder

Set up the database schema and seed initial data (1 user: test@mail.com, password123; 10 products):
```bash
php artisan migrate --seed
```

### 7. Install Frontend Dependencies

Navigate to the client/ directory and install Node.js dependencies:
```bash
cd client
npm install
```

### 8. Configure Frontend Environment Variables

Create a .env file in client/ and update the configurations
```bash
cd client
cp .env.example .env
```

### 9. Start the Backend Development Server

From the project root:
```bash
php artisan serve
```
The backend will be available at http://localhost:8000.

### 10. Start the Frontend Development Server

In a new terminal, from the client/ directory:
```bash
npm start
```

The frontend will be available at http://localhost:3000.

### 11. Access the Application

- Frontend: Open http://localhost:3000 in your browser.
- Login: Use test@mail.com and password123 to log in.
- A sample csv file has been added to public/csv folder.
