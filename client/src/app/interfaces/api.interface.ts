export interface RestAPIResponse {
  token: string
  user: User
}

export interface User {
  email: string
  username: string
  role: 'ADMIN' | 'SALESPERSON'
}
