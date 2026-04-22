import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { createStudent } from '../services/api'

/* Dialog form for creating a new student in the teacher's class. */
function CreateStudentDialog({ open, className, onClose, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
  })

  /* Updates dialog form field values. */
  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /* Resets dialog local state after successful create or close. */
  const resetState = () => {
    setError('')
    setLoading(false)
    setForm({ first_name: '', last_name: '', id_number: '' })
  }

  /* Closes dialog and clears form state. */
  const handleClose = () => {
    resetState()
    onClose()
  }

  /* Submits create-student request and notifies parent on success. */
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createStudent({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        id_number: form.id_number.trim(),
        class_name: className,
      })

      resetState()
      onCreated()
      onClose()
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to create student.')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Student</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              value={form.first_name}
              onChange={(event) => handleFieldChange('first_name', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              value={form.last_name}
              onChange={(event) => handleFieldChange('last_name', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="ID Number"
              value={form.id_number}
              onChange={(event) => handleFieldChange('id_number', event.target.value)}
              required
              fullWidth
            />
            <TextField label="Class" value={className || ''} fullWidth disabled />
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateStudentDialog
