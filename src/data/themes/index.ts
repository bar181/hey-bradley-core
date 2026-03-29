import saas from './saas.json'
import agency from './agency.json'
import portfolio from './portfolio.json'
import blog from './blog.json'
import startup from './startup.json'
import personal from './personal.json'
import professional from './professional.json'
import wellness from './wellness.json'
import creative from './creative.json'
import minimalist from './minimalist.json'

export const THEME_REGISTRY = [
  saas,
  agency,
  portfolio,
  blog,
  startup,
  personal,
  professional,
  wellness,
  creative,
  minimalist,
] as const

export type ThemePreset = (typeof THEME_REGISTRY)[number]

export {
  saas,
  agency,
  portfolio,
  blog,
  startup,
  personal,
  professional,
  wellness,
  creative,
  minimalist,
}
