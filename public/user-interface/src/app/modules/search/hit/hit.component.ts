import { Component, Input, OnInit } from '@angular/core'
import { Hit } from 'angular-instantsearch/instantsearch/instantsearch'

@Component({
  selector: 'app-hit',
  templateUrl: './hit.component.html',
  styleUrls: ['./hit.component.css']
})
export class HitComponent {
  @Input('hit') hit!: Hit

  getLocaleDateString (dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }
}
