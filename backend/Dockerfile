# Use an official lightweight Python image
FROM python:3.11-slim

# Set work directory inside the container
WORKDIR /app

# Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port 8000
EXPOSE 8000

# Default command (we will override this in docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]