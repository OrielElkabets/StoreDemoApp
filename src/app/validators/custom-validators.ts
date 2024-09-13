import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static int(control: AbstractControl<unknown>): ValidationErrors | null {
        if (Number.isInteger(control.value)) return null
        else return { nonInteger: { value: control.value } }
    }
}