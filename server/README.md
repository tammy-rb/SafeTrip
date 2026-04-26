# SafeTrip Server API

The server provides:
- JWT cookie authentication (register, login, logout)
- Teacher and student data APIs
- Student location updates and latest-location retrieval
- alerts for teachers for too-far students

## Base URL
- Local: http://localhost:5000

## Quick Start
1. Open terminal in the server folder.
2. Install dependencies:
   - npm install
3. Initialize database and seed data:
   - npm run init-db
4. Start server:
   - npm run start

## Environment Variables
Create a .env file in the project root (one level above server) with:
- MYSQL_HOST
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DB
- JWT_SECRET

## Authentication Model
Login and register return a JWT cookie that is valid for 1 day.
The cookie contains the user identity details and is used by protected routes for authentication and user recognition.

## Health Endpoints
### GET /health
Response 200:
- { "status": "ok" }

### GET /
Response 200:
- { "message": "SafeTrip server is running" }

## Auth Endpoints
### POST /auth/register
Description:
- Registers password for existing teacher/student by id_number.
- Returns full user details from Teachers or Students table.

Request body:
- {
    "id_number": "302111111",
    "password": "StrongPass1!"
  }

Validation rules:
- id_number must be 9 digits
- password must be at least 8 chars and include upper, lower, digit, special char
- id_number must exist in Teachers or Students
- user must not already be registered in Passwords

Success response 201 (created):
- {
    "message": "Registration successful",
    "role": "teacher",
    "id_number": "302111111",
    "user": {
      "id": 1,
      "first_name": "Miriam",
      "last_name": "Cohen",
      "id_number": "302111111",
      "class_name": "A1"
    }
  }

Error response:
- { "error": "..." }

### POST /auth/login
Description:
- Authenticates by id_number and password.
- Returns full user details from Teachers or Students table.

Request body:
- {
    "id_number": "302111111",
    "password": "StrongPass1!"
  }

Success response 200:
- {
    "message": "Login successful",
    "role": "teacher",
    "id_number": "302111111",
    "user": {
      "id": 1,
      "first_name": "Miriam",
      "last_name": "Cohen",
      "id_number": "302111111",
      "class_name": "A1"
    }
  }

Error response:
- { "error": "..." }

### POST /auth/logout
Description:
- Clears jwt cookie.

Success response 200:
- { "message": "Logout successful" }

## Students Endpoints (Teacher only)
All endpoints below require valid jwt cookie with role teacher.

### GET /students
Optional query params:
- class_name (or class)
- id_number

Example:
- /students?class_name=A1

Success response 200:
- [
    {
      "id": 1,
      "first_name": "Noa",
      "last_name": "BenDavid",
      "id_number": "323000001",
      "class_name": "A1"
    }
  ]

### GET /students/:id
Success response 200:
- {
    "id": 1,
    "first_name": "Noa",
    "last_name": "BenDavid",
    "id_number": "323000001",
    "class_name": "A1"
  }

Not found 404:
- { "error": "Student not found" }

### POST /students
Request body:
- {
    "first_name": "Noa",
    "last_name": "BenDavid",
    "id_number": "323000001",
    "class_name": "A1"
  }

Success response 201:
- {
    "id": 11,
    "first_name": "Noa",
    "last_name": "BenDavid",
    "id_number": "323000001",
    "class_name": "A1"
  }

## Teachers Endpoints (Teacher only)
All endpoints below require valid jwt cookie with role teacher.

### GET /teachers
Optional query params:
- class_name (or class)
- id_number

Example:
- /teachers?id_number=302111111

Success response 200:
- [
    {
      "id": 1,
      "first_name": "Miriam",
      "last_name": "Cohen",
      "id_number": "302111111",
      "class_name": "A1"
    }
  ]

### GET /teachers/:id
Success response 200:
- {
    "id": 1,
    "first_name": "Miriam",
    "last_name": "Cohen",
    "id_number": "302111111",
    "class_name": "A1"
  }

Not found 404:
- { "error": "Teacher not found" }

### POST /teachers
Request body:
- {
    "first_name": "Miriam",
    "last_name": "Cohen",
    "id_number": "302111111",
    "class_name": "A1"
  }

Success response 201:
- {
    "id": 3,
    "first_name": "Miriam",
    "last_name": "Cohen",
    "id_number": "302111111",
    "class_name": "A1"
  }

## Tracking Endpoints
Current behavior:
- No history table.
- One latest location row per student id_number (upsert/replace).

next, i would like to make a log for locations post requests, so i can view any student location history.

Access rules:
- POST /tracking/location requires student authentication and only for the same student ID 
- GET /tracking/latest and GET /tracking/latest/:id_number are teacher-only.
- GET /tracking/locations-alerts is teacher-only.

### POST /tracking/location
Description:
- Validates payload, converts DMS to decimal coordinates, and stores latest location.

Request body format:
- {
    "ID": "323000002",
    "Coordinates": {
      "Longitude": { "Degrees": "34", "Minutes": "46", "Seconds": "44" },
      "Latitude": { "Degrees": "32", "Minutes": "5", "Seconds": "23" }
    },
    "Time": "2024-12-05T15:30:00Z"
  }

Validation:
- Coordinates.Longitude and Coordinates.Latitude are required
- Degrees/minutes/seconds must be valid integers and ranges
- Time must be valid ISO date
- ID must exist in Students table
- Authenticated student can send location only for their own ID

Success response 200:
- { "ok": true }

Error response:
- { "error": "..." }

### GET /tracking/latest
Description:
- Returns latest location for all students.

Optional query params:
- class_name (or class)

Example:
- /tracking/latest?class_name=A1

Success response 200:
- [
    {
      "student_id_number": "323000001",
      "longitude_decimal": 34.7788889,
      "latitude_decimal": 32.0897222,
      "raw_longitude_deg": 34,
      "raw_longitude_min": 46,
      "raw_longitude_sec": 44,
      "raw_latitude_deg": 32,
      "raw_latitude_min": 5,
      "raw_latitude_sec": 23,
      "device_time": "2024-12-05T15:30:00.000Z",
      "received_at": "2026-04-22T05:40:11.000Z",
      "class_name": "A1"
    }
  ]

### GET /tracking/latest/:id_number
Description:
- Returns latest location for one student.

Success response 200:
- {
    "student_id_number": "323000001",
    "longitude_decimal": 34.7788889,
    "latitude_decimal": 32.0897222,
    "raw_longitude_deg": 34,
    "raw_longitude_min": 46,
    "raw_longitude_sec": 44,
    "raw_latitude_deg": 32,
    "raw_latitude_min": 5,
    "raw_latitude_sec": 23,
    "device_time": "2024-12-05T15:30:00.000Z",
    "received_at": "2026-04-22T05:40:11.000Z"
  }

Not found 404:
- { "error": "Latest location not found for this student." }

### GET /tracking/locations-alerts
Description:
- Returns latest locations for the teacher's students, plus air-distance and alert flag per student.
- Teacher is identified from JWT cookie (`jwt`).
- Distance is computed as straight-line (Haversine) and alert is true when distance is greater than 3 km.

Request:
- No request body
- No query params
- Requires valid teacher auth cookie

Success response 200:
- {
    "threshold_km": 3,
    "teacher_location": {
      "teacher_id": "302111111",
      "longitude_decimal": 34.7805556,
      "latitude_decimal": 32.0875000,
      "raw_longitude_deg": 34,
      "raw_longitude_min": 46,
      "raw_longitude_sec": 50,
      "raw_latitude_deg": 32,
      "raw_latitude_min": 5,
      "raw_latitude_sec": 15,
      "device_time": "2026-04-22T13:00:00.000Z",
      "received_at": "2026-04-25T11:22:33.000Z"
    },
    "students": [
      {
        "student_id_number": "323000001",
        "longitude_decimal": 34.7836111,
        "latitude_decimal": 32.0888889,
        "raw_longitude_deg": 34,
        "raw_longitude_min": 47,
        "raw_longitude_sec": 1,
        "raw_latitude_deg": 32,
        "raw_latitude_min": 5,
        "raw_latitude_sec": 20,
        "device_time": "2026-04-22T12:30:00.000Z",
        "received_at": "2026-04-25T11:22:33.000Z",
        "class_name": "A1",
        "distance_km": 0.329,
        "is_far_from_teacher": false
      },
      {
        "student_id_number": "323000005",
        "longitude_decimal": 34.7725000,
        "latitude_decimal": 32.0827778,
        "raw_longitude_deg": 34,
        "raw_longitude_min": 46,
        "raw_longitude_sec": 21,
        "raw_latitude_deg": 32,
        "raw_latitude_min": 4,
        "raw_latitude_sec": 58,
        "device_time": "2026-04-22T12:34:00.000Z",
        "received_at": "2026-04-25T11:22:33.000Z",
        "class_name": "A1",
        "distance_km": 3.412,
        "is_far_from_teacher": true
      }
    ]
  }

