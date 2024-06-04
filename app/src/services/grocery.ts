import ky from 'ky'

import { env } from '@constants/env'

export const getGroceryList = async (params: { priority?: number; status?: string; perPage?: number }) => {
  const searchParams = new URLSearchParams(params as Record<string, string>)
  const response = await ky.get(`${env.API_URL}/grocery`, { searchParams }).json<{ data: GroceryItem[] }>()

  return response.data
}

export const createGroceryItem = async (groceryItem: GroceryFormItem) => {
  const response = await ky.post(`${env.API_URL}/grocery`, { json: groceryItem }).json<{ data: GroceryItem }>()

  return response.data
}
