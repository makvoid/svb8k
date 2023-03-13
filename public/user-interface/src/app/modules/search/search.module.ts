import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgAisModule } from 'angular-instantsearch'

import { SearchComponent } from './search/search.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchBoxComponent } from './search-box/search-box.component';
import { HitComponent } from './hit/hit.component';
import { OnVisibleDirective } from 'src/app/util/on-visible-directive';
import { BaseModule } from '../base/base.module';

@NgModule({
  declarations: [
    SearchComponent,
    SearchBoxComponent,
    HitComponent,
    OnVisibleDirective
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    BaseModule,
    NgAisModule
  ],
  providers: [
    
  ]
})
export class SearchModule { }
