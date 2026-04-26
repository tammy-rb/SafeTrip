# SafeTrip Client

This is the React client for SafeTrip.
It has two user experiences: teacher dashboard and student page.

## Main Features

### Teacher dashboard
- View students of the teacher class.
- Search students by ID.
- Add a new student.
- View student markers on map.
- See too-far students highlighted (red marker when distance is over 3 km).
- Refresh location data automatically every 5 seconds.

### Student page
- View own profile details.
- Send a new tracking update with one button.
- The send button reads latest location and submits a new point around 100m east.

## Tech Stack

- React + Vite
- Material UI
- Leaflet + react-leaflet
- Axios

## Run Client

1. Install dependencies:
- npm install

2. Start development server:
- npm run dev

By default the client calls server at http://localhost:5000.
You can override this with VITE_API_URL.
