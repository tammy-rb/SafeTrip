# SafeTrip - School Trip Management and Tracking

SafeTrip is a school-trip management system.
It combines three things in one project:
- registration and class management,
- live map tracking for students,
- automatic too-far alerts for teachers.

## assumptions
- location updates are automatic from students and teachers hardware, so there is no need to implement the hardware side.
- when a student connects to the software, her device sends automatic location updates.
- same for teacher - once connected, the hardware sends location automatically.
- i added a button that updates the student location by 100+ meters to the east only for development, so i can verify the map and the alert flags work correctly.

## my way
- in this project, i tried to keep SOLID design principles. so my code will be OCP style (open for extension, closed for modification), so the app is easier to extend and maintain.
- also, i wanted to understand the area of the project, so i can do it in the best way. so i learnt about the DMS geo coordinates represntation and the harvesine formula (which compute air distance between 2 points).

## sources
- for map handling (something i had less experience with), i used these sources for explanations and examples:
- https://leafletjs.com/reference.html
- https://codesandbox.io/examples/package/leaflet
- https://react-leaflet.js.org/docs/start-introduction/
- for understanding geo coordinates, DMS, and the haversine formula (air distance), i used this source:
- https://medium.com/@fernnichanun/%EF%B8%8F-understanding-the-3-formats-of-latitude-and-longitude-5ac6e95410d9
- https://en.wikipedia.org/wiki/Haversine_formula
- code implementation and explanation:
https://dev.to/ayushman/measure-distance-between-two-locations-in-javascript-using-the-haversine-formula-7dc
- i also used AI for explanations on some of the math.
- gps to DMS coordinates calculator:
https://www.gps-coordinates.net/
example:
![gps to DMS coordinates](assets/image.png)

## Server Overview

What the server handles:
- Secure authentication with JWT cookie.
- Role-based access control (teacher and student).
- Teacher and student data insertion and retrieval.
- Receives student location updates and converts them into a simple format the system can use.
- Teacher class location view with distance and too-far flags.

Main API groups:
- Authentication: register, login, logout.
- Teachers: insert and retrieve teacher records (teacher-only routes).
- Students: insert and retrieve student records (teacher-only routes).
- Tracking:
- Receive location updates from student devices.
- Return latest student locations.
- Let teacher fetch class students locations with:
- each student location,
- each student air-distance from teacher,
- too-far flag (true when distance > 3 km).
- i also gave a student the ability to get his latest location (used for development/testing flow).

Detailed API request/response documentation:
- server/README.md

For easier development, I added an `init_db` function so I can quickly recreate and reseed the database whenever needed.

## Client Overview

### Teacher dashboard
Teacher can:
- View class students in a table.
- Search students by ID.
- Add new students.
- See all his class students on a map.
- Identify too-far students by marker color.
- Manually refresh data.

Auto-refresh behavior:
- The dashboard asks the server for updated location data every 5 seconds.
( - for developement, i reduced the polling interval into 1 second, so i can see students movement more faster. but in production - to aviod overloading the server- i will make polling in higher interval. )

Too-far visual rule:
- Red marker: student is farther than 3 km from teacher.
- Default marker: student is within 3 km. (blue)

### Student page
Student can:
- Login and view profile details.
- Logout.
- Click Send Location (+100m East). - for developement only!

What the button does:
- Reads student latest location from server.
- Computes a point about 100 meters east.
- Sends new location payload in the same DMS tracking format.
this button is for developement only, so i can check the map and too far feature in the app. in production - im gonna remove this feature.

## Database Overview

Main tables:
- Teachers
- Students
- Passwords
- StudentLocationsLatest
- TeacherLocationsLatest

## How to Run

1. Initialize database and seed data:
- In server folder: npm run init-db

2. Start server:
- In server folder: npm run start

3. Start client:
- In client folder: npm run dev

## Notes

- Full server endpoint docs are in server/README.md.
- Current teacher dashboard polling interval is 1 second.


## Screenshots

### 1. Authentication
Register and login flow for teacher/student users.

![Authentication screen](assets/image-3.png)

### 2. Teacher Dashboard
Main teacher workspace: students table, map tracking, and too-far visualization.

![Teacher dashboard - students and map](assets/image.png)
![Teacher dashboard - tracking view](assets/image-1.png)

### 3. Student Page
Student view with profile details and the quick location update action.

![Student page](assets/image-2.png)