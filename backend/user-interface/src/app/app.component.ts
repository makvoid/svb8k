import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AppService } from './app.service';
import { Report } from './extra/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  reports: Report[] = []
  lastObjectID = 'N/A'
  form = this.fb.group({
    description: this.fb.control('')
  })

  constructor(public appService: AppService, private fb: FormBuilder) { }

  getCompanyName() {
    return this.reports[0].title.match(/(8-K|8-K\/A)( - )(.+) \(\d{10}\)/)[3]
  }

  async deleteRecord() {
    await firstValueFrom(this.appService.deleteReport(this.reports[0].objectID))
    this.reports.splice(0, 1)
    this.form.get('description').reset()
  }

  async saveRecord (affected: string) {
    try {
      await firstValueFrom(this.appService.saveReport(
        this.reports[0].objectID,
        affected,
        this.form.value.description
      ))
    } catch (e) {
      console.error(e)
      return
    }
    this.lastObjectID = this.reports[0].objectID
    this.reports.splice(0, 1)
    this.form.get('description').reset()
  }

  skipRecord() {
    this.reports.push(...this.reports.splice(0, 1))
  }

  async ngOnInit() {
    this.reports = await firstValueFrom(this.appService.getReports())
  }
}
