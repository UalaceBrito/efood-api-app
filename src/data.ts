export type Dish = {
  id: number
  nome: string
  descricao: string
  foto: string
  preco: number
  porcao: string
}

export type Restaurant = {
  id: number
  titulo: string
  destacado: boolean
  tipo: string
  avaliacao: number
  descricao: string
  capa: string
  cardapio: Dish[]
}

const API_URL = 'https://api-ebac.vercel.app/api/efood/restaurantes'

export async function fetchRestaurants(signal?: AbortSignal): Promise<Restaurant[]> {
  const response = await fetch(API_URL, { signal })
  if (!response.ok) throw new Error(`Falha ao carregar restaurantes (${response.status})`)
  return response.json()
}

export const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
