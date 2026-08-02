import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Currency, formatCurrencyPrice as formatPriceWithLang } from './currency'

export { type Currency } from './currency'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: Currency = 'USD', lang: string = 'en'): string {
  return formatPriceWithLang(amount, currency, lang)
}

/**
 * Safari & iOS Compatible Safe Date Formatter
 */
export function formatDate(dateInput: Date | string | null | undefined, locale: string = 'en'): string {
  if (!dateInput) return ''
  let date: Date

  if (typeof dateInput === 'string') {
    const cleanStr = dateInput.trim()
    // Safari Fix: Convert "YYYY-MM-DD HH:MM:SS" to ISO "YYYY-MM-DDTHH:MM:SS"
    const isoStr = cleanStr.includes(' ') && !cleanStr.includes('T') ? cleanStr.replace(' ', 'T') : cleanStr
    date = new Date(isoStr)

    // Fallback for older WebKit / Safari engines
    if (isNaN(date.getTime())) {
      date = new Date(cleanStr.replace(/-/g, '/'))
    }
  } else {
    date = dateInput
  }

  if (isNaN(date.getTime())) {
    return String(dateInput)
  }

  try {
    return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    return date.toISOString().split('T')[0]
  }
}

export function generateBookingNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  return `MR-${new Date().getFullYear()}-${randomDigits}`
}
