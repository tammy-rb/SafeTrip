import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import CreateStudentDialog from '../components/CreateStudentDialog'
import MapView from '../components/MapView'
import SearchBar from '../components/SearchBar'
import StudentsTable from '../components/StudentsTable'
import { getLocationsWithAlerts, getStudentsByClass, logoutUser } from '../services/api'

/* Renders teacher dashboard with students, map, and create-student flow. */
function Dashboard({ session, onLogout }) {
  const [students, setStudents] = useState([])
  const [locations, setLocations] = useState([])
  const [searchId, setSearchId] = useState('') // for filtering students by ID number
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const className = session?.user?.class_name  // class of the teacher

  /* Loads students and location data for teacher class. */
  const loadData = async () => {
    if (!className) {
      return
    }

    setError('')
    setLoading(true)

    try {
      const [studentsResult, locationsResult] = await Promise.all([
        getStudentsByClass({ class_name: className }),
        getLocationsWithAlerts(),
      ])

      setStudents(studentsResult)
      setLocations(locationsResult.students || [])
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  /* Polls latest locations every 5 seconds for near real-time updates. */
  useEffect(() => {
    if (!className) {
      return undefined
    }

    loadData()  // students and locations on initial load

    const intervalId = window.setInterval(async () => {
      try {
        const locationsResult = await getLocationsWithAlerts()
        setLocations(locationsResult.students || [])
      } catch {
        // silent polling failure; manual refresh can recover
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [className])

  /* Filters students table by typed ID number. */
  const filteredStudents = useMemo(() => {
    const value = searchId.trim()
    if (!value) {
      return students
    }
    return students.filter((student) => String(student.id_number).includes(value))
  }, [students, searchId])

  /* Logs out user on server and clears local session state. */
  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      onLogout()
    }
  }

  /* Opens the create-student dialog and resets form messages. */
  const handleOpenCreate = () => {
    setCreateOpen(true)
  }

  /* Closes the create-student dialog. */
  const handleCloseCreate = () => {
    setCreateOpen(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 1100, mx: 'auto' }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h4" component="h1">
              Track Dashboard
                </Typography>
                <Typography color="text.secondary">
                  {session?.user?.first_name} {session?.user?.last_name} | Class {className}
                </Typography>
              </Box>
              <Button type="button" variant="outlined" onClick={handleLogout} sx={{ alignSelf: 'flex-start' }}>
                Logout
              </Button>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                <Typography variant="h6">Students List</Typography>
                <Button variant="contained" onClick={handleOpenCreate}>
                  Add Student
                </Button>
              </Stack>
              <SearchBar
                value={searchId}
                onChange={setSearchId}
                onRefresh={loadData}
                loading={loading}
              />
              {error ? <Alert severity="error">{error}</Alert> : null}
              {loading ? (
                <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <StudentsTable students={filteredStudents} />
              )}
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="h6">Locations Map</Typography>
              <MapView locations={locations} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <CreateStudentDialog
        open={createOpen}
        className={className}
        onClose={handleCloseCreate}
        onCreated={loadData}
      />
    </Box>
  )
}

export default Dashboard
