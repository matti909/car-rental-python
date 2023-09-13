'use client'
import React, { createContext, useRef, useState } from 'react'

interface FormContextProps {
  state: {
    values: Record<string, string>
  }
  actions: {
    register: (name: string) => {
      ref: React.RefObject<HTMLInputElement>
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
      name: string
    }
    getValues: () => Record<string, string>
  }
}

interface Props {
  children: React.ReactNode
}

export const FormStateContext = createContext({} as FormContextProps)

export const FormAppProvider = ({ children }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({})

  const register = (name: string) => {
    const ref = useRef<HTMLInputElement>(null)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prevValues => ({
        ...prevValues,
        [name]: e.target.value,
      }))
    }

    return { ref, onChange, name }
  }

  const getValues = () => values

  return (
    <FormStateContext.Provider
      value={{
        state: {
          values,
        },
        actions: {
          register,
          getValues,
        },
      }}
    >
      {children}
    </FormStateContext.Provider>
  )
}
