import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { loginUser, registerUser } from '../services/api'

/* Authentication page with register and login modes. */
function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login')
  const [idNumber, setIdNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* Handles submit for both login and register flows. */
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        id_number: idNumber.trim(),
        password,
      }

      const result = mode === 'register'
        ? await registerUser(payload)
        : await loginUser(payload)

      onAuthSuccess(result)    // session management
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                SafeTrip
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register or login to continue.
              </Typography>
            </Box>

            <ToggleButtonGroup
              fullWidth
              color="primary"
              exclusive
              value={mode}
              onChange={(_, value) => {
                if (value) {
                  setMode(value)
                }
              }}
            >
              <ToggleButton value="login">Login</ToggleButton>
              <ToggleButton value="register">Register</ToggleButton>
            </ToggleButtonGroup>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  id="id_number"
                  label="ID Number"
                  type="text"
                  inputMode="numeric"
                  placeholder="9 digits"
                  value={idNumber}
                  onChange={(event) => setIdNumber(event.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  fullWidth
                />

                {error ? <Alert severity="error">{error}</Alert> : null}

                <Button type="submit" variant="contained" disabled={loading} fullWidth>
                  {loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthPage
