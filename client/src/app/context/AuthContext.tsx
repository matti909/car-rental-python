'use client'

import { createContext, useState } from 'react'

interface User {
  username: string
  email: string
  role: string
}

interface context {
  state: {
    error: string
    authError: string
    loading: boolean
    user: User | null
  }
  action: {
    setAuthError: (authError: string) => void
    setLoading: (loading: boolean) => void
    setUser: (user: User | null) => void
  }
}

interface Props {
  children: React.ReactNode
}

const AuthContext = createContext({} as context)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState<string | null>('')
  const [loading, setLoading] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        state: { user, loading, authError },
        action: { setLoading, setUser, setAuthError },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContext
