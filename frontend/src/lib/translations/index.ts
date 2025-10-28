import en from './en.json'
import tw from './tw.json'

export type Language = 'en' | 'tw' | 'ga' | 'ew' | 'ha'

export const translations = {
  en,
  tw,
  ga: en, // Fallback to English for now
  ew: en, // Fallback to English for now
  ha: en  // Fallback to English for now
}

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi' },
  { code: 'ga', name: 'Ga', nativeName: 'Ga' },
  { code: 'ew', name: 'Ewe', nativeName: 'Eʋe' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' }
] as const

export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const keys = key.split('.')
  let value: any = translations[language] || translations.en
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if translation not found
      value = translations.en
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey]
        if (value === undefined) {
          return key // Return key if no translation found
        }
      }
      break
    }
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // Replace parameters in the translation
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] || match
    })
  }
  
  return value
}

export function useTranslation(language: Language = 'en') {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(language, key, params)
  }
  
  return { t, language, languages }
}
