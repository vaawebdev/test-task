import { env } from '@constants/env'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ky from 'ky'

export interface GroceryItem {
  id: string
  name: string
  quantity?: number
  priority?: number
  status?: 'RANOUT' | 'HAVE'
  statusUpdatedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateGroceryMutationPayload {
  name: string
  quantity?: number
}

export interface UpdateGroceryMutationPayload {
  id: string
  name?: string
  quantity?: number
  priority?: number
  status?: 'RANOUT' | 'HAVE'
}

export interface GroceryListPayload {
  priority?: number
  status?: string
}

export const GROCERY_LIST_QUERY_KEY = 'groceryList'

export const useGroceryListQuery = (params: GroceryListPayload = {}) => {
  return useQuery({
    queryKey: [GROCERY_LIST_QUERY_KEY],
    queryFn: async cxt => {
      const searchParams = new URLSearchParams(params as Record<string, string>)
      const { data } = await ky
        .get(`${env.API_URL}/grocery`, { searchParams, signal: cxt.signal })
        .json<{ data: GroceryItem[] }>()
      return data
    },
  })
}

export const useCreateGroceryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateGroceryMutationPayload) => {
      const { data } = await ky.post(`${env.API_URL}/grocery`, { json: payload }).json<{ data: GroceryItem }>()
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GROCERY_LIST_QUERY_KEY] })
    },
  })
}

export const useUpdateGroceryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateGroceryMutationPayload) => {
      const { data } = await ky.patch(`${env.API_URL}/grocery/${id}`, { json: payload }).json<{ data: GroceryItem }>()
      return data
    },
    onSuccess: item => {
      queryClient.setQueryData([GROCERY_LIST_QUERY_KEY], (data?: GroceryItem[]) => {
        if (!data) return
        return data.map(it => (it.id === item.id ? item : it))
      })
    },
  })
}

export const useDeleteGroceryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await ky.delete(`${env.API_URL}/grocery/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData([GROCERY_LIST_QUERY_KEY], (data?: GroceryItem[]) => {
        if (!data) return
        return data.filter(it => it.id !== id)
      })
    },
  })
}
