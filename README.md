
---

# Gamified Habit Tracker 🎮✅

This project combines a **Django backend** and a **React + Vite + Tailwind frontend**.
Follow the steps below to get everything running locally.

---

## 📦 Requirements

* Node.js `>=20`
* Python `>=3.12`
* Git

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/gamified-habit-tracker.git
cd gamified-habit-tracker
```

---

### 2. Backend (Django API)

#### Create and activate virtual environment

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Run migrations and create superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

#### Start the server

```bash
python manage.py runserver 8000
```

Backend will be available at:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 3. Frontend (React + Vite + Tailwind)

#### Install dependencies

```bash
cd ../frontend
npm install
```

#### Start development server

```bash
npm run dev
```

Frontend will be available at:
👉 [http://localhost:5173](http://localhost:5173)

---

