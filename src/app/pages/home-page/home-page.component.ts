import { Component, inject } from '@angular/core';
import { ItemsService } from '../../services/items.service';
import { ItemComponent } from "../../components/item/item.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [ItemComponent]
})
export class HomePageComponent {
  readonly itemsService = inject(ItemsService)
}
