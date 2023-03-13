import { Component, ViewChild } from '@angular/core';

import { SearchBoxComponent } from '../search-box/search-box.component';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @ViewChild('searchBox') searchBox: SearchBoxComponent

  constructor(
    public searchService: SearchService,
  ) { }

  showRefineButton () {
    const lastResults = this.searchBox.instantSearchInstance.instantSearchInstance.helper.lastResults
    return lastResults.page + 1 < lastResults.nbPages
  }
}
