import decode from 'jwt-decode'
import { Settings, DateTime } from 'luxon'
import type { Token } from '../app/interfaces/token.interface'

export const tokenDecode = <T>(token: string): T => {
  const createDecode: T = decode(token)
  return createDecode
}

export const expirationTokenAuht = (token: string): boolean => {
  Settings.defaultZone = 'America/Buenos_Aires'
  Settings.defaultLocale = 'es'
  const { exp } = tokenDecode<Token>(token)
  const now = DateTime.now().toMillis()

  return exp * 1000 <= now
}
