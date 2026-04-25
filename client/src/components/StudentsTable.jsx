import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

/* Displays students in a table. */
function StudentsTable({ students }) {
  if (!students.length) {
    return <Typography color="text.secondary">No students found.</Typography>
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: '#d7e3f4',
        boxShadow: '0 10px 24px rgba(14, 33, 66, 0.06)',
      }}
    >
      <Table size="small" sx={{ minWidth: 420 }}>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                bgcolor: '#f4f8ff',
                color: '#24477d',
                fontWeight: 700,
                borderBottom: '1px solid #d7e3f4',
                py: 1.25,
              },
            }}
          >
            <TableCell>Student</TableCell>
            <TableCell>ID Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id_number}
              sx={{
                '& td': {
                  borderBottom: '1px solid #edf2fb',
                  py: 1.1,
                },
                '&:nth-of-type(odd)': {
                  bgcolor: '#fbfdff',
                },
                '&:hover': {
                  bgcolor: '#f2f7ff',
                },
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f3f70' }}>
                    {student.first_name} {student.last_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={student.id_number}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: 'monospace',
                    letterSpacing: 0.3,
                    borderColor: '#bfd0ea',
                    bgcolor: '#f7faff',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default StudentsTable
