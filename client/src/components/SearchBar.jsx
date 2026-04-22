import { Box, Button, Stack, TextField } from '@mui/material'

/* Renders search input and refresh action for dashboard filtering. */
function SearchBar({ value, onChange, onRefresh, loading }) {
  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          label="Search by ID"
          placeholder="Type ID number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          size="small"
          fullWidth
        />
        <Button variant="outlined" onClick={onRefresh} disabled={loading}>
          Refresh
        </Button>
      </Stack>
    </Box>
  )
}

export default SearchBar
