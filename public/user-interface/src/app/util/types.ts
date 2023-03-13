export interface AlertParameters {
  type: 'info' | 'success' | 'warning' | 'error'
  text: string
  pulse?: boolean
}

export interface ContactRequestResponse {
  success: boolean
  message: string
}
