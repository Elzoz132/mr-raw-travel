export type Currency = 'USD' | 'EUR' | 'EGP' | 'GBP'

export interface CurrencyConfig {
  code: Currency
  symbol: string
  nameEn: string
  nameAr: string
  rateToUsd: number
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي', rateToUsd: 1.0 },
  EUR: { code: 'EUR', symbol: '€', nameEn: 'Euro', nameAr: 'يورو', rateToUsd: 0.92 },
  GBP: { code: 'GBP', symbol: '£', nameEn: 'British Pound', nameAr: 'جنيه استرليني', rateToUsd: 0.78 },
  EGP: { code: 'EGP', symbol: 'EGP', nameEn: 'Egyptian Pound', nameAr: 'جنيه مصري', rateToUsd: 48.5 },
}

export function convertPrice(amountInUsd: number, targetCurrency: Currency): number {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD
  return Math.round(amountInUsd * config.rateToUsd)
}

export function formatCurrencyPrice(amount: number, currency: Currency = 'USD', lang: string = 'en'): string {
  const isArabic = lang === 'ar'

  if (isArabic) {
    const arabicNum = amount.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    switch (currency) {
      case 'EUR':
        return `${arabicNum} يورو`
      case 'GBP':
        return `${arabicNum} جنيه استرليني`
      case 'EGP':
        return `${arabicNum} ج.م`
      case 'USD':
      default:
        return `${arabicNum} دولار`
    }
  }

  switch (currency) {
    case 'EUR':
      return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    case 'GBP':
      return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    case 'EGP':
      return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} EGP`
    case 'USD':
    default:
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
}
