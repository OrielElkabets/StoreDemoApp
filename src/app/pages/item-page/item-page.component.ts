import { Component, inject } from '@angular/core';
import { Item } from '../../models/item';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemComponent } from "../../components/item/item.component";
import { EditItemComponent } from "../../components/edit-item/edit-item.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { Title } from '@angular/platform-browser';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-item-page',
  standalone: true,
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.scss',
  imports: [ItemComponent, EditItemComponent, LoadingSpinnerComponent, RouterLink]
})
export class ItemPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly itemsService = inject(ItemsService)

  loading = true
  item?: Item

  constructor(title: Title) {
    this.activatedRoute.paramMap
      .subscribe(paramMap => {
        const id = paramMap.get("id")
        if (id === null) throw Error("id should not be null here!")

        this.itemsService.getItemById(parseInt(id))
          .subscribe(item => {
            this.loading = false
            if (item) {
              this.item = item
              title.setTitle(`מוצר - ${item.name}`)
            }
            else title.setTitle(`מוצר לא נמצא`)
          })
      })
  }
}
