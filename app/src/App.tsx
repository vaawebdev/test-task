import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Add, Edit, Save } from '@mui/icons-material'
import { Card, CardContent, CardHeader, IconButton } from '@mui/material'
import Container from '@mui/material/Container'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import GroceryForm from '@components/GroceryForm'
import GroceryList from '@components/GroceryList'

const queryClient = new QueryClient()

function App() {
  const [openForm, setOpenForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleFormOpen = () => {
    setOpenForm(true)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Card sx={{ my: 4 }} variant="outlined">
          <CardHeader
            title="Grocery List"
            action={
              <>
                <IconButton onClick={handleEditClick}>{isEditing ? <Save /> : <Edit />}</IconButton>
                <IconButton onClick={handleFormOpen}>
                  <Add />
                </IconButton>
              </>
            }
          />
          <CardContent>
            <GroceryList isEditing={isEditing} />
            {openForm && <GroceryForm setOpenForm={setOpenForm} />}
          </CardContent>
        </Card>
      </Container>
    </QueryClientProvider>
  )
}

export default App
