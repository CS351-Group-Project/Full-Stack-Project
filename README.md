# CultureConnect

CultureConnect is a full-stack web app for discovering and managing culture-based events.

It combines:

- **User accounts** (register/login)
- **User profiles** (country, culture, age, profile picture)
- **Internal events** stored in the app
- **External events** pulled in from other sources
- A **ranking algorithm** based on a priority queue and a Bloom filter
- A **React** frontend with dashboard, explore page, and profile management

---

## Tech Stack

**Backend**

- Python 3
- Django 5.2
- Django REST Framework
- django-cors-headers
- SQLite (default dev database)
- Pillow (for image uploads)

**Frontend**

- React (Create React App style)
- React Router
- Fetch-based API client

---

## HOW TO RUN IT

**Basic Setup**
- commands: 
    1) python3 -m venv venv
    2) source venv/bin/activate
    3) pip install -r requirements.txt


**Backend** 
- command: 
    1) cd backend/
    2) python manage.py runserver

**Backend** 
- command: 
    1) cd frontend/
    2) npm install
    3) npm start







