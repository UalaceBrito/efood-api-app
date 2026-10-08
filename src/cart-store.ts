import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { Dish } from './data'

export type CartLine = {
  dish: Dish
  restaurantId: number
  quantity: number
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartLine[] },
  reducers: {
    addItem(state, action: PayloadAction<{ dish: Dish; restaurantId: number }>) {
      const { dish, restaurantId } = action.payload
      const existing = state.items.find((line) => line.dish.id === dish.id && line.restaurantId === restaurantId)
      if (existing) existing.quantity += 1
      else state.items.push({ dish, restaurantId, quantity: 1 })
    },
  },
})

export const store = configureStore({ reducer: { cart: cartSlice.reducer } })

type RootState = ReturnType<typeof store.getState>

const selectCount = (state: RootState) => state.cart.items.reduce((total, line) => total + line.quantity, 0)

export function useCart() {
  const dispatch = useDispatch<typeof store.dispatch>()
  const count = useSelector(selectCount)
  return {
    count,
    addItem: (dish: Dish, restaurantId: number) => dispatch(cartSlice.actions.addItem({ dish, restaurantId })),
  }
}
