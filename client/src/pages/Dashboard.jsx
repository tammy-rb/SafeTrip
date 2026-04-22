import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { logoutUser } from '../services/api'

/* Placeholder teacher dashboard for phase 1. */
function Dashboard({ session, onLogout }) {
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
              Teacher Dashboard
            </Typography>
            <Typography>
              Logged in as {session?.user?.first_name} {session?.user?.last_name}
            </Typography>
            <Typography color="text.secondary">
              Placeholder: dashboard content is not implemented yet.
            </Typography>
            <Button type="button" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
