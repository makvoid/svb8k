import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactComponent } from './modules/base/contact/contact.component';
import { FaqComponent } from './modules/base/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    title: 'Search 8-Ks',
    loadChildren: () => import('./modules/search/search.module').then((m) => m.SearchModule)
  },
  {
    path: 'faq',
    title: 'FAQ',
    component: FaqComponent
  },
  {
    path: 'contact',
    title: 'Contact',
    component: ContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
