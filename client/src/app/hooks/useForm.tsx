import { useContext } from 'react'
import { FormStateContext } from '../context/FormContext'

export const useFormContext = () => {
  const context = useContext(FormStateContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
