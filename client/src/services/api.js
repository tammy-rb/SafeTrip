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

export default api
