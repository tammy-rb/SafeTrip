import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { getMyLatestLocation, logoutUser, sendStudentLocation } from '../services/api'
import { buildTrackingPayload, shiftLongitudeEast } from '../utils/locationHelpers'

/*
  Student page UI:
  - Shows student identity details.
  - Provides a button that fetches the student's latest server location and sends a new location
    shifted about 100 meters to the east.
  - Includes status/error alerts and logout action.
*/

function StudentPage({ session, onLogout }) {
  const [loadingMove, setLoadingMove] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  /* Logs out user on server and clears local session state. */
  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      onLogout()
    }
  }

  /* Fetches latest server location and sends a new one shifted 100m east. */
  const handleSendMovedLocation = async () => {
    setLoadingMove(true)
    setError('')
    setStatusMessage('')

    try {
      const latest = await getMyLatestLocation()

      const nextLongitude = shiftLongitudeEast({
        longitude: latest.longitude_decimal,
        latitude: latest.latitude_decimal,
        meters: 100,
      })

      const payload = buildTrackingPayload({
        idNumber: session?.id_number,
        longitude: nextLongitude,
        latitude: latest.latitude_decimal,
      })

      await sendStudentLocation(payload)
      setStatusMessage('Location sent: moved about 100 meters to the east.')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to send moved location.')
    } finally {
      setLoadingMove(false)
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
      <Card sx={{ width: '100%', maxWidth: 640 }}>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h4" component="h1">
              Welcome, {session?.user?.first_name || 'Student'}! You are connected.
            </Typography>
            <Typography>ID: {session?.id_number}</Typography>
            <Typography>Class: {session?.user?.class_name}</Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {statusMessage ? <Alert severity="success">{statusMessage}</Alert> : null}
            <Button type="button" variant="contained" onClick={handleSendMovedLocation} disabled={loadingMove}>
              {loadingMove ? 'Sending...' : 'Send Location (+100m East)'}
            </Button>
            <Button type="button" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StudentPage
