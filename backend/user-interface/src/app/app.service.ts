import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from 'src/environments/environment'
import { Report, ReportSaveResponse } from './extra/types'

@Injectable({ providedIn: 'root' })
export class AppService {
  // Base headers to include with every request
  baseOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  constructor (
    private http: HttpClient
  ) { }

  deleteReport (objectID: string) {
    return this.http.delete(
      `${environment.apiUrl}ingress/${objectID}`,
      this.baseOptions
    )
  }

  saveReport (objectID: string, affected: string, description: string) {
    return this.http.post<ReportSaveResponse>(
      `${environment.apiUrl}ingress/${objectID}/processed`,
      {
        affected,
        description
      },
      this.baseOptions
    )
  }

  getReports () {
    return this.http.get<Report[]>(
      `${environment.apiUrl}ingress`,
      this.baseOptions
    )
  }
}