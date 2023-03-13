import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-base-form',
  template: ''
})
export class BaseFormComponent {
  constructor (public formBuilder: FormBuilder) { }

  getErrorString (type: string, value: any) {
    switch (type) {
      case 'required':
        return 'This field is required.'
      case 'email':
        return 'A valid email is required.'
      case 'minlength':
        return `Please provide a value that is at least ${value.requiredLength - value.actualLength} characters longer.`
      default:
        return 'This value is unexpected, please try again.'
    }
  }

  getControlErrors (field: string, form: FormGroup) {
    const control = form.get(field)!
    return control.errors ? Object.keys(control.errors).map(entry => ({ type: entry, error: this.getErrorString(entry, control.errors![entry]) })) : []
  }

  isControlValid (field: string, form: FormGroup) {
    const control = form.get(field)!
    if (!control.dirty) return true
    return !control.invalid
  }

  markFieldAsDirty (field: string, form: FormGroup) {
    form.get(field)!.markAsDirty()
  }
}