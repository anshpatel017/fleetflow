# Fleetflow Project Setup Guide

This project consists of a Django backend and a Vite + React frontend. Follow these steps to set up the project on a new device.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **pip** and **npm**

---

## 1. Database Setup

1.  **Start PostgreSQL**: Ensure your local PostgreSQL server is running.
2.  **Create Database**: Create a database named `fleetflow`.
    ```bash
    psql -U postgres -c "CREATE DATABASE fleetflow;"
    ```

---

## 2. Backend Setup (Django)

1.  **Navigate to Backend**:
    ```bash
    cd backend
    ```
2.  **Create Virtual Environment**:
    ```bash
    python -m venv venv
    ```
3.  **Activate Environment**:
    - **Windows**: `.\venv\Scripts\activate`
    - **Linux/Mac**: `source venv/bin/activate`
4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Environment Variables**: Create a `.env` file in the `backend/` directory with the following:
    ```env
    SECRET_KEY=your-secret-key
    DEBUG=True
    DB_NAME=fleetflow
    DB_USER=postgres
    DB_PASSWORD=your-postgresql-password
    DB_HOST=localhost
    DB_PORT=5432
    ```
6.  **Run Migrations**:
    ```bash
    python manage.py migrate
    ```
7.  **Start Backend**:
    ```bash
    python manage.py runserver
    ```

---

## 3. Frontend Setup (React + Vite)

1.  **Navigate to Frontend**:
    ```bash
    cd frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Frontend**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Folder Structure

- `/backend`: Django project files, API endpoints, and database models.
- `/frontend`: React application, UI components, and state management.

## Contributing

1.  Ensure you have updated your `.gitignore` to avoid committing local environment files.
2.  Use clear commit messages and follow the existing coding style.
