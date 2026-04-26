import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* Shared axios client configured for cookie-based auth. */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

/* Sends register request with id_number and password. */
export const registerUser = async (payload) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

/* Sends login request with id_number and password. */
export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}

/* Calls logout endpoint and clears auth cookie on server side. */
export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

/* Fetches students list for a specific class, with optional ID filter. */
export const getStudentsByClass = async ({ class_name, id_number }) => {
  const response = await api.get('/students', {
    params: {
      class_name,
      id_number: id_number || undefined,
    },
  })
  return response.data
}

/* Fetches latest tracking locations, optionally filtered by class. */
export const getLatestLocations = async ({ class_name }) => {
  const response = await api.get('/tracking/latest', {
    params: {
      class_name,
    },
  })
  return response.data
}

/* Fetches class students latest locations with distance and >3km teacher alert flag. */
export const getLocationsWithAlerts = async () => {
  const response = await api.get('/tracking/locations-alerts')
  return response.data
}

/* Fetches the latest location row for the authenticated student. */
export const getMyLatestLocation = async () => {
  const response = await api.get('/tracking/my-latest')
  return response.data
}

/* Sends a new student tracking payload in device-like DMS format. */
export const sendStudentLocation = async (payload) => {
  const response = await api.post('/tracking/location', payload)
  return response.data
}

/* Creates a new student record. */
export const createStudent = async (payload) => {
  const response = await api.post('/students', payload)
  return response.data
}

export default api
