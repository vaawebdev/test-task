import { Delete } from '@mui/icons-material'
import {
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import dayjs from 'dayjs'
import { GroceryItem, useDeleteGroceryMutation, useGroceryListQuery, useUpdateGroceryMutation } from 'queries/grocery'
import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react'

const GroceryList: FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const { data, isLoading, isError, error } = useGroceryListQuery()

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
            <TableCell>Status Changed At</TableCell>
            {isEditing && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(item => (
            <Grocery key={item.id} item={item} isEditing={isEditing} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const GroceryQuantity: FC<{ item: GroceryItem; isEditing?: boolean }> = ({ item, isEditing }) => {
  const { mutate, isPending: isUpdating } = useUpdateGroceryMutation()
  const [quantity, setQuantity] = useState(item.quantity)

  const handleUpdate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (item.quantity === e.target.valueAsNumber) return
      setQuantity(e.target.valueAsNumber)
      mutate(
        {
          id: item.id,
          quantity: e.target.valueAsNumber,
        },
        {
          onSuccess: ({ quantity }) => {
            setQuantity(quantity)
          },
        },
      )
    },
    [mutate, item.id, item.quantity],
  )

  return (
    <TableCell>
      {isEditing ? (
        <TextField value={quantity} inputProps={{ maxLength: 2 }} type="number" onChange={handleUpdate} />
      ) : (
        item.quantity
      )}
    </TableCell>
  )
}

const GroceryStatus: FC<{ item: GroceryItem }> = ({ item }) => {
  const { mutate, isPending: isUpdating } = useUpdateGroceryMutation()

  const handleUpdate = useCallback(() => {
    mutate({
      id: item.id,
      status: item.status === 'HAVE' ? 'RANOUT' : 'HAVE',
    })
  }, [mutate, item.id, item.status])

  return (
    <TableCell>
      <Checkbox checked={item.status === 'HAVE'} disabled={isUpdating} onChange={handleUpdate} />
    </TableCell>
  )
}

const Grocery: FC<{ item: GroceryItem; isEditing?: boolean }> = ({ item, isEditing }) => {
  const { mutate, isPending: isDeleting } = useDeleteGroceryMutation()

  const statusUpdatedAt = useMemo(() => {
    if (!item.statusUpdatedAt) return '-'
    return dayjs(item.statusUpdatedAt).toDate().toLocaleTimeString()
  }, [item.statusUpdatedAt])

  const handleDelete = useCallback(() => {
    mutate(item.id)
  }, [mutate, item.id])

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <GroceryQuantity item={item} isEditing={isEditing} />
      <GroceryStatus item={item} />
      <TableCell>{statusUpdatedAt}</TableCell>
      {isEditing && (
        <TableCell>
          <IconButton onClick={handleDelete} disabled={isDeleting}>
            <Delete />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  )
}

export default GroceryList
