import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { HeaderComponent } from './header/header.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { AlertComponent } from './alert/alert.component';
import { BaseFormComponent } from './base-form/base-form.component';

@NgModule({
  declarations: [
    FaqComponent,
    ContactComponent,
    HeaderComponent,
    PageTitleComponent,
    AlertComponent,
    BaseFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FaqComponent,
    ContactComponent,
    HeaderComponent,
    PageTitleComponent,
    AlertComponent,
    BaseFormComponent
  ]
})
export class BaseModule { }
