import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from 'src/environments/environment'
import { ContactRequestResponse } from './util/types'

@Injectable({ providedIn: 'root' })
export class AppService {
  // Base headers to include with every request
  baseOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  constructor (
    private http: HttpClient,
  ) { }

  sendContactRequest (payload: { name: string, email: string, message: string }) {
    return this.http.post<ContactRequestResponse>(
      `${environment.apiUrl}/contact`,
      payload,
      this.baseOptions
    )
  }
}