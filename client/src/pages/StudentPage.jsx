import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { logoutUser } from '../services/api'

/* Minimal student page to confirm successful connection. */
function StudentPage({ session, onLogout }) {
  /* Logs out user on server and clears local session state. */
  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      onLogout()
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
