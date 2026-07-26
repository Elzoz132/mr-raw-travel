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

export function formatDate(dateInput: Date | string, locale: string = 'en'): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function generateBookingNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  return `MR-${new Date().getFullYear()}-${randomDigits}`
}
