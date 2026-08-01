import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currency } from '@/lib/currency'
import { Language } from '@/lib/i18n/dictionaries'

export interface BookingDraft {
  tripId?: string
  tripTitle?: string
  tripCover?: string
  packageId?: string
  packageNameEn?: string
  packageNameAr?: string
  packageNameDe?: string
  priceAdultUsd?: number
  priceChildUsd?: number
  priceAdultEur?: number
  priceChildEur?: number
  priceAdultEgp?: number
  priceChildEgp?: number
  priceAdultGbp?: number
  priceChildGbp?: number
  tripDate?: string
  adults: number
  children: number
  hotelName?: string
  hotelAddress?: string
  roomNumber?: string
  fullName?: string
  email?: string
  phone?: string
  whatsApp?: string
  nationality?: string
  emergencyContact?: string
  specialNotes?: string
  selectedAddons?: Array<{
    id: string
    nameEn: string
    nameAr: string
    priceEgp: number
    priceUsd: number
    priceEur: number
  }>
  isCustomPackage?: boolean
  paymentMethod?: string
  receiptUrl?: string
}

export interface UserProfile {
  id?: string
  name: string
  email: string
  role: string
}

interface AppState {
  currency: Currency
  setCurrency: (c: Currency) => void
  language: Language
  setLanguage: (l: Language) => void
  wishlist: string[]
  toggleWishlist: (tripId: string) => void
  bookingDraft: BookingDraft
  updateBookingDraft: (partial: Partial<BookingDraft>) => void
  resetBookingDraft: () => void
  currentUser: UserProfile | null
  setCurrentUser: (u: UserProfile | null) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
      language: 'en',
      setLanguage: (language) => set({ language }),
      wishlist: [],
      toggleWishlist: (tripId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(tripId)
            ? state.wishlist.filter((id) => id !== tripId)
            : [...state.wishlist, tripId],
        })),
      bookingDraft: {
        adults: 2,
        children: 0,
      },
      updateBookingDraft: (partial) =>
        set((state) => ({
          bookingDraft: { ...state.bookingDraft, ...partial },
        })),
      resetBookingDraft: () =>
        set({
          bookingDraft: { adults: 2, children: 0 },
        }),
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      isSearchOpen: false,
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
    }),
    {
      name: 'mr-raw-travel-store',
      partialize: (state) => ({
        currency: state.currency,
        language: state.language,
        wishlist: state.wishlist,
        bookingDraft: state.bookingDraft,
        currentUser: state.currentUser,
      }),
    }
  )
)
