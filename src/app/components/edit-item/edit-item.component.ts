import { Component, inject, Input } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../models/item';
import { ItemsService } from '../../services/items.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { Router } from '@angular/router';
import { LockInteractions } from '../../utils/lock-interactions';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.scss',
  imports: [ReactiveFormsModule, LoadingSpinnerComponent]
})
export class EditItemComponent {
  @Input({ required: true }) set item(item: Item) {
    this.form.patchValue(item)
    this._item = item
  }

  private readonly router = inject(Router)
  private readonly itemsService = inject(ItemsService)
  private readonly formBuilder = inject(NonNullableFormBuilder)

  _item?: Item
  readonly sendingUpdate = new LockInteractions()
  readonly deletingItem = new LockInteractions()
  readonly form = this.formBuilder.group({
    name: ["", [Validators.required]],
    qty: [0, [Validators.required, Validators.min(0), CustomValidators.int]],
    price: [0, [Validators.required, Validators.min(0), CustomValidators.int]],
    description: new FormControl<string | null>(null),
  })

  sendForm() {
    if (this.form === undefined || this._item === undefined || !this.form.valid) return

    this.sendingUpdate.lock(200)
    const formValue = this.form.getRawValue()
    formValue.description = formValue.description || null

    this.itemsService.updateItem(this._item.id, formValue)
      .subscribe(() => this.sendingUpdate.unlock())
  }

  deleteItem() {
    if (this._item) {
      this.deletingItem.lock(200)
      this.itemsService.deleteItem(this._item.id)
        .subscribe(deleteSucceed => {
          if (deleteSucceed) this.router.navigateByUrl("/")
          else this.deletingItem.unlock()
        })
    }
  }
}