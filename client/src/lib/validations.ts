export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? '' : 'Por favor, ingresa un email válido'
}

export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9]).{6,16}$/
  return passwordRegex.test(password)
    ? ''
    : 'La contraseña debe tener entre 6 y 16 caracteres, incluyendo al menos una mayúscula'
}
