'use client'
import React, { createContext, useRef, useState } from 'react'

interface FormContextProps {
  state: {
    values: Record<string, string>
    errors: Record<string, string>
  }
  actions: {
    register: (name: string) => {
      ref: React.RefObject<HTMLInputElement>
      onBlur: () => void
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
      name: string
    }
    handleSubmit: (e: React.FormEvent) => void
    getValues: () => Record<string, string>
    hasError: (name: string) => boolean
  }
}

interface Props {
  children: React.ReactNode
}

export const FormStateContext = createContext({} as FormContextProps)

export const FormAppProvider = ({ children }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const register = (name: string) => {
    const ref = useRef<HTMLInputElement>(null)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prevValues => ({
        ...prevValues,
        [name]: e.target.value,
      }))
    }

    return { ref, onBlur, onChange, name }
  }
  const onBlur = () => {
    // Optional: You can add onBlur logic here
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with values:', values)
    // Optional: Add validation logic and set errors if needed
  }

  const getValues = () => values

  const hasError = (name: string) => !!errors[name]

  return (
    <FormStateContext.Provider
      value={{
        state: {
          values,
          errors,
        },
        actions: {
          register,
          handleSubmit,
          getValues,
          hasError,
        },
      }}
    >
      {children}
    </FormStateContext.Provider>
  )
}
