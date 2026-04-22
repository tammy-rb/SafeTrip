import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import StudentPage from './pages/StudentPage'

/*
  App component with route guards and role-based redirects.
  On app load, tries to restore session from localStorage and redirects to the appropriate page.
  If user is not authenticated, redirects to /auth for login or registration.
  else, if user is already authenticated, redirects to /dashboard for teachers or /student for students.
  After successful login or registration, saves session to localStorage and redirects to role-based home page.
  Provides logout functionality that clears session from state and localStorage.
*/

/* Loads saved session from localStorage if available. */
const loadSession = () => {
  try {
    const raw = localStorage.getItem('safetrip_session')
    if (!raw) {
      return null
    }
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/* 
  Persists session state to localStorage.
  if session is null, removes any existing session from storage.
*/
const saveSession = (session) => {
  if (session) {
    localStorage.setItem('safetrip_session', JSON.stringify(session))
    return
  }
  localStorage.removeItem('safetrip_session')
}

/* Root app with route guards and role-based redirects. */
function App() {
  const [session, setSession] = useState(loadSession)

  /* Stores authenticated session after login/register. */
  const handleAuthSuccess = (payload) => {
    const nextSession = {
      role: payload.role,
      id_number: payload.id_number,
      user: payload.user,
    }
    setSession(nextSession)
    saveSession(nextSession)
  }

  /* Clears client session and cookie. */
  const handleLogout = () => {
    setSession(null)
    saveSession(null)
  }

  /* Derives redirect target by current role. */
  const roleHomePath = useMemo(() => {
    if (session?.role === 'teacher') {
      return '/dashboard'
    }
    if (session?.role === 'student') {
      return '/student'
    }
    return '/auth'
  }, [session])

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          session ? (
            <Navigate to={roleHomePath} replace />
          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          session?.role === 'teacher' ? (
            <Dashboard session={session} onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/student"
        element={
          session?.role === 'student' ? (
            <StudentPage session={session} onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={roleHomePath} replace />} />
    </Routes>
  )
}

export default App
