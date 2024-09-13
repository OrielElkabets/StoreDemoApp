import { inject, Injectable } from '@angular/core';
import { Item, NewItem, UpdateItem } from '../models/item';
import { ApiService } from './api.service';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly apiService = inject(ApiService)
  items: Item[] = []

  constructor() {
    this.apiService.getAllItems()
      .subscribe({
        next: res => this.items = res,
        error: err => {
          alert("קבלת מוצרים נכשלה")
          console.error(err);
        }
      })
  }

  getItemById(id: number) {
    const item = this.items.find(item => item.id === id)
    if (item) return of(item)

    return this.apiService.getItemById(id)
      .pipe(
        catchError(err => {
          console.error(err);
          return of(null)
        })
      )
  }

  updateItem(id:number, item: UpdateItem) {
    return this.apiService.updateItem(id, item)
      .pipe(
        catchError(err => {
          alert("עריכת מוצר נכשלה")
          console.error(err);
          return of(null)
        }),
        tap(res => {
          if (res) {
            const index = this.items.findIndex(i => i.id === id)
            if (index !== -1) this.items.splice(index, 1, res)
          }
        })
      )
  }

  addItem(item: NewItem) {
    return this.apiService.createItem(item)
      .pipe(
        catchError(err => {
          alert("הוספת מוצר נכשלה")
          console.error(err);
          return of(null)
        }),
        tap(res => {
          if (res) this.items.push(res)
        })
      )
  }

  deleteItem(id: number) {
    return this.apiService.deleteItem(id)
      .pipe(
        catchError(err => {
          alert("מחיקת מוצר נכשלה")
          console.error(err);
          return of(false)
        }),
        map(res => {
          const success = res !== false
          return success
        }),
        tap(deleteSucceed => {
          if (deleteSucceed) this.items = this.items.filter(i => i.id !== id)
        })
      )
  }
}
