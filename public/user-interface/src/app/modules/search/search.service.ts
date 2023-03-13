import { Injectable } from '@angular/core'
import algoliasearch, { SearchClient } from 'algoliasearch'
import { InstantSearchConfig } from 'angular-instantsearch/instantsearch/instantsearch'

import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })
export class SearchService {
  // Load App Id & API Key from localStorage (configured during setup)
  searchClient: SearchClient = algoliasearch(
    environment.algolia.appId || '',
    environment.algolia.apiKey || ''
  )

  // Setup InstantSearch configuration
  config: InstantSearchConfig = {
    indexName: environment.algolia.indexName || '',
    searchClient: this.searchClient
  }
}
