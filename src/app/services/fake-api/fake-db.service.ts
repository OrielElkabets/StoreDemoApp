import { Injectable } from "@angular/core"
import { Item, NewItem } from "../../models/item"

@Injectable({
    providedIn: "root"
})
export class FakeDb {
    private static id = 1
    private readonly items: Item[] = []

    constructor() {
        this.addItem({
            name: "כיסא",
            price: 250,
            qty: 10,
            description: "כיסא משרדי"
        })

        this.addItem({
            name: "שולחן",
            price: 500,
            qty: 7,
            description: "שולחן עבודה מעץ"
        })
    }

    getItems() {
        return this.items
    }

    getItemById(id: number) {
        return this.items.find(i => i.id === id)
    }

    addItem(newItem: NewItem) {
        const item = { id: FakeDb.id++, ...newItem }
        this.items.push(item)
        return item
    }

    updateItem(item: Item) {
        const index = this.items.findIndex(i => i.id === item.id)
        if (index === -1) return null
        this.items.splice(index, 1, item)
        return item
    }

    deleteItem(id: number) {
        const index = this.items.findIndex(i => i.id === id)
        if (index !== -1) {
            this.items.splice(index, 1)
        }
        return `item with ${id} removed successfully`
    }
}