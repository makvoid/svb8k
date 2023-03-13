import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AppService } from 'src/app/app.service';

import { AlertParameters, ContactRequestResponse } from 'src/app/util/types';
import { BaseFormComponent } from '../base-form/base-form.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends BaseFormComponent {

  constructor(private appService: AppService, private fb: FormBuilder) {
    super(fb)
  }

  alertParams: AlertParameters = {
    type: 'info', text: '', pulse: false
  }

  form = this.fb.group({
    name: this.fb.control('', [Validators.minLength(3), Validators.required]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    message: this.fb.control('', [Validators.minLength(20), Validators.required]),
  })

  resetAlert () {
    this.alertParams = {
      type: 'info', text: '', pulse: false
    }
  }

  async onFormSubmit() {
    const form = this.form.value
    this.resetAlert()

    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName)
        control.markAsDirty()
      })
      this.alertParams = { type: 'error', text: 'Please correct any issues with the form before submitting.' }
      return
    }

    let response: ContactRequestResponse
    try {
      response = await firstValueFrom(this.appService.sendContactRequest({
        name: form.name,
        email: form.email,
        message: form.message
      }))
    } catch (e) {
      console.error(e)
      this.alertParams = { type: 'error', text: e.error.message }
      return
    }

    // Detect any issues sending the email
    if (!response.success) {
      this.alertParams = { type: 'error', text: response.message }
      return
    }

    // If we sent the request successfully, let the User know and reset the form
    this.alertParams = { type: 'success', text: response.message }
    this.form.reset()
  }
}
