import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ItemPageComponent } from './pages/item-page/item-page.component';
import { AddItemPageComponent } from './pages/add-item-page/add-item-page.component';

export const routes: Routes = [
    { path: "", component: HomePageComponent, title: "מוצרים" },
    { path: "item/:id", component: ItemPageComponent },
    { path: "add-item", component: AddItemPageComponent, title: "הוספת מוצר" }
];
