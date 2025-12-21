# Peer-to-Peer Mock Interview Platform

A two-sided marketplace connecting job seekers (Interviewees) with industry professionals (Interviewers) for paid, 1-hour mock interviews. The platform handles scheduling, secure payments, and profile verification.

## 🚀 Features

### 1. Interviewer Module (Service Provider)
* **Profile Management:** Set professional Title, Company, Bio, and Hourly Rate.
* **Availability:** Define specific 1-hour time slots for availability.
* **Meeting Integration:** Provide static Zoom/Google Meet links for sessions.
* **Payouts:** Connect Stripe account to receive earnings (Stripe Connect).

### 2. Interviewee Module (Customer)
* **Discovery:** Browse experts by Domain, Company, and Price.
* **Booking:** Secure slots via Stripe payment.
* **Frictionless Access:** No passwords—login instantly via Google, Facebook, or LinkedIn.

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
| **Authentication** | **Social Login Only** | Google, Facebook, LinkedIn (via AllAuth) |
| **Database** | PostgreSQL | Relational data (Users, Bookings) |
| **Containerization** | Docker & Docker Compose | Consistent dev/prod environment |
| **Payments** | Stripe Connect | Marketplace split payments |

---

## 💻 How to Run Locally

### Prerequisites
* **Docker Desktop** (Must be installed and running)

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd interview-platform
    ```

2.  **Build and Start the System**
    This downloads Python, installs dependencies, and starts the Database.
    ```bash
    docker compose up --build
    ```
    *Wait until you see the logs say "Starting development server at 0.0.0.0:8000"*

3.  **Initialize Database** (Run in a new terminal)
    ```bash
    docker compose run backend python manage.py migrate
    ```

4.  **Create an Admin User**
    Create your superuser account to access the dashboard.
    ```bash
    docker compose run backend python manage.py createsuperuser
    ```

### 🛑 Critical Configuration (Required for Login)
Since the platform uses **Social Login Only**, the API will not work until you add the Provider Keys in the database.

1.  Go to `http://localhost:8000/admin` and log in with your superuser.
2.  Navigate to **Social Accounts** > **Social Applications**.
3.  Click **Add Social Application**.
4.  **Google Example:**
    * **Provider:** Google
    * **Name:** Google
    * **Client ID:** (From Google Cloud Console)
    * **Secret Key:** (From Google Cloud Console)
    * **Sites:** Move `example.com` (or localhost) to the "Chosen" list on the right.

---

## 📂 Project Structure

```text
interview-platform/
├── docker-compose.yml      # The "Master Plan" connecting Django + Postgres
├── backend/                # The Django Application
│   ├── Dockerfile          # Instructions to build the Python environment
│   ├── requirements.txt    # List of Python libraries
│   ├── manage.py           # Django command entry point
│   ├── core/               # Project Settings (Keys, DB Config, Auth)
│   └── base/               # The "App" (Models, Views, Logic)
│       ├── models.py       # Database Schema (User, Interviewer, Booking)
│       ├── admin.py        # Admin Panel Configuration
│       └── views.py        # API Endpoints (Social Auth)
└── README.md               # You are here