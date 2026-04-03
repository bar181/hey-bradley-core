import saas from './saas.json'
import agency from './agency.json'
import portfolio from './portfolio.json'
import startup from './startup.json'
import personal from './personal.json'
import professional from './professional.json'
import wellness from './wellness.json'
import minimalist from './minimalist.json'

export const THEME_REGISTRY = [
  saas,
  agency,
  portfolio,
  startup,
  personal,
  professional,
  wellness,
  minimalist,
] as const

export type ThemePreset = (typeof THEME_REGISTRY)[number]

export {
  saas,
  agency,
  portfolio,
  startup,
  personal,
  professional,
  wellness,
  minimalist,
}
