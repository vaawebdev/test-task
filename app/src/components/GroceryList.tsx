import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
  TextField,
} from '@mui/material'
import { Delete } from '@mui/icons-material'

import { useGroceryList } from 'hooks/useGrocery'

const GroceryList: FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const { data, isLoading, isError, error } = useGroceryList()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            {isEditing && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{isEditing ? <TextField value={item.quantity} /> : item.quantity}</TableCell>
              <TableCell>
                <Checkbox checked={item.status === 'HAVE'} />
              </TableCell>
              {isEditing && (
                <TableCell>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GroceryList
