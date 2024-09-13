import { Component, inject } from '@angular/core';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { ItemsService } from '../../services/items.service';
import { FormBuilder, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LockInteractions } from '../../utils/lock-interactions';
import { NewItem } from '../../models/item';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
    selector: 'app-add-item-page',
    standalone: true,
    templateUrl: './add-item-page.component.html',
    styleUrl: './add-item-page.component.scss',
    imports: [LoadingSpinnerComponent, ReactiveFormsModule]
})
export class AddItemPageComponent {
    private readonly itemsService = inject(ItemsService)
    private readonly formBuilder = inject(FormBuilder)

    readonly sendingReq = new LockInteractions()
    readonly form = this.formBuilder.group({
        name: ["", [Validators.required]],
        qty: [0, [Validators.required, Validators.min(0), CustomValidators.int]],
        price: [0, [Validators.required, Validators.min(0), CustomValidators.int]],
        description: [""],
    })

    constructor() {
        // reset the form so all the valus are null at the start
        this.form.reset()
    }

    sendForm() {
        if (this.form === undefined || !this.form.valid) return

        this.sendingReq.lock(200)
        const formValue = this.form.getRawValue()
        formValue.description = formValue.description || null

        // user not supposed to enter this function if form isn't valid
        // but this check validate that the validators actually corect 
        // and not allowing values that shouldn't be in new item
        if (
            formValue.name === null ||
            formValue.qty === null ||
            formValue.price === null
        ) throw new Error("values should not be null here")

        // here we should be safe, but for TS to know that we have valid NewItem
        // I create new NewItem and copy the form data to it
        // in case that the data of the form will be in invalid state TS should error here
        const newItem: NewItem = {
            name: formValue.name,
            price: formValue.price,
            qty: formValue.qty,
            description: formValue.description
        }

        this.itemsService.addItem(newItem)
            .subscribe(() => {
                this.form.reset()
                this.sendingReq.unlock()
            })
    }
}
