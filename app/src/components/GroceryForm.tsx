import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { CreateGroceryMutationPayload, useCreateGroceryMutation } from 'queries/grocery'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

export type GroceryFormProps = {
  setOpenForm: (openForm: boolean) => void
}

const GroceryForm: FC<GroceryFormProps> = ({ setOpenForm }) => {
  const { handleSubmit, control } = useForm<CreateGroceryMutationPayload>()
  const { mutateAsync: createGroceryItem } = useCreateGroceryMutation()

  const handleFormClose = () => {
    setOpenForm(false)
  }

  const onSubmit = (data: CreateGroceryMutationPayload) => {
    createGroceryItem(data, {
      onSuccess: () => {
        setOpenForm(false)
      },
    })
  }

  return (
    <Dialog open onClose={handleFormClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} autoFocus margin="dense" label="Name" fullWidth />}
          />
          <Controller
            name="quantity"
            control={control}
            defaultValue={0}
            render={({ field }) => <TextField {...field} margin="dense" label="Quantity" fullWidth />}
          />
          <DialogActions>
            <Button onMouseDown={handleFormClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GroceryForm
