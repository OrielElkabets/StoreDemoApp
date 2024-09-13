import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Item, NewItem } from '../models/item';
import APP_CONFIG from '../app.config.json';
import { joinPath } from '../utils/join-path';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly client = inject(HttpClient)

  getAllItems() {
    return this.client.get<Item[]>(joinPath(APP_CONFIG.apiRoot, "items"))
  }

  getItemById(id: number) {
    return this.client.get<Item>(joinPath(APP_CONFIG.apiRoot, "items", id))
  }

  createItem(newItem: NewItem) {
    return this.client.post<Item>(joinPath(APP_CONFIG.apiRoot, "items/create"), newItem)
  }

  updateItem(id: number, itemToUpdate: NewItem) {
    return this.client.put<Item>(joinPath(APP_CONFIG.apiRoot, "items/update", id), itemToUpdate)
  }

  deleteItem(id: number) {
    return this.client.delete(joinPath(APP_CONFIG.apiRoot, "items/delete", id), { responseType: "text" })
  }
}
