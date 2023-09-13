export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Por favor, ingresa un email válido'
}

export const validatePassword = (password: string): string | null => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9]).{6,16}$/
  return passwordRegex.test(password)
    ? null
    : 'La contraseña debe tener entre 6 y 16 caracteres, incluyendo al menos una mayúscula'
}
