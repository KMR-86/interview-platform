# Peer-to-Peer Mock Interview Platform

A two-sided marketplace connecting job seekers (Interviewees) with industry professionals (Interviewers) for paid, 1-hour mock interviews. The platform handles scheduling, payments, and profile verification.

## 🚀 Features

### 1. Interviewer Module (Service Provider)
* **Profile Management:** Create profiles with Title, Company, Bio, and Hourly Rate.
* **Availability:** Set specific 1-hour time slots for availability.
* **Meeting Integration:** Provide static Zoom/Google Meet links for sessions.
* **Payouts:** Connect bank accounts to receive earnings (Stripe Connect).

### 2. Interviewee Module (Customer)
* **Discovery:** Browse interviewers by Domain, Company, and Price.
* **Booking:** Securely book slots via Stripe payment.
* **Dashboard:** View upcoming interviews and access meeting links.
* **Review:** (Planned) Rate sessions after completion.

### 3. Admin Module (Platform Owner)
* **Verification:** Review and approve/reject new interviewer profiles.
* **User Management:** Ban/Suspend users.
* **Dispute Handling:** Manage refunds and cancellations.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python (Django 5) | Core logic & Admin Panel |
| **API** | Django REST Framework | RESTful APIs for Frontend |
| **Frontend** | React.js + Vite | (Planned) User Interface |
| **Database** | PostgreSQL | Relational data (Users, Bookings) |
| **Containerization** | Docker & Docker Compose | Consistent dev/prod environment |
| **Authentication** | Django Allauth | Google/LinkedIn OAuth |
| **Payments** | Stripe Connect | Marketplace split payments |

---

## 💻 How to Run Locally

### Prerequisites
* **Docker Desktop** (Must be installed and running)
* That's it! You do not need Python or Node.js installed on your machine.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd interview-platform
    ```

2.  **Build and Start the System**
    This downloads Python, installs Django, and starts the Database.
    ```bash
    docker compose up --build
    ```
    *Wait until you see the logs say "Starting development server at http://0.0.0.0:8000/"*

3.  **Apply Database Migrations** (Run in a new terminal)
    Initialize the database tables.
    ```bash
    docker compose run backend python manage.py migrate
    ```

4.  **Create an Admin User**
    Create your superuser account to access the dashboard.
    ```bash
    docker compose run backend python manage.py createsuperuser
    ```

### Accessing the App

* **Backend API:** `http://localhost:8000/api/` (Coming soon)
* **Admin Dashboard:** `http://localhost:8000/admin/`
    * *Login with the credentials you just created.*

---

## 📂 Project Structure

```text
interview-platform/
├── docker-compose.yml      # The "Master Plan" connecting Django + Postgres
├── backend/                # The Django Application
│   ├── Dockerfile          # Instructions to build the Python environment
│   ├── requirements.txt    # List of Python libraries
│   ├── manage.py           # Django command entry point
│   ├── core/               # Project Settings (Keys, DB Config)
│   └── base/               # The "App" (Models, Views, Logic)
│       ├── models.py       # Database Schema (User, Interviewer, Booking)
│       ├── admin.py        # Admin Panel Configuration
│       └── views.py        # API Endpoints
└── README.md               # You are here