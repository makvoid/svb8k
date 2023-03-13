import { Component, Inject, forwardRef, Optional, OnDestroy } from '@angular/core'
import { StatsRenderState } from 'instantsearch.js/es/connectors/stats/connectStats'
import { TypedBaseWidget, NgAisInstantSearch, NgAisIndex } from 'angular-instantsearch'
import connectSearchBox, {
  SearchBoxWidgetDescription,
  SearchBoxConnectorParams
} from 'instantsearch.js/es/connectors/search-box/connectSearchBox'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent extends TypedBaseWidget<SearchBoxWidgetDescription, SearchBoxConnectorParams> implements OnDestroy {
  public override state: SearchBoxWidgetDescription['renderState']
  subscriptions: Subscription[] = []

  constructor (
    @Inject(forwardRef(() => NgAisIndex))
    @Optional()
    public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch
  ) {
    super('SearchBox')
  }

  getStats (state: StatsRenderState) {
    if (state.processingTimeMS === -1) {
      return null
    }
    return `${state.nbHits} result${state.nbHits !== 1 ? 's' : ''} found in ${state.processingTimeMS}ms`
  }

  override ngOnInit () {
    this.createWidget(connectSearchBox, {})
    super.ngOnInit()
  }

  override ngOnDestroy () {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    super.ngOnDestroy()
  }
}
