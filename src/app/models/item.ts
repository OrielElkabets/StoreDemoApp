export type Item = {
    id: number
    name: string
    qty: number
    price: number
    description: string | null
}

export type NewItem = Omit<Item, "id"> 
export type UpdateItem = Omit<Item, "id"> 