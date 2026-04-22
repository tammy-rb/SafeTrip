import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

/* Defines a minimal MUI theme for the client app. */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f5fbf',
    },
    background: {
      default: '#f4f7fb',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
