import { CustomerBookingsClient } from '@/components/customer/CustomerBookingsClient'

export const metadata = {
  title: 'My Bookings & Trips | Mr.Raw Travel',
  description: 'View and manage all your booked excursions, vouchers, and payment statuses.'
}

export default function CustomerBookingsPage() {
  return <CustomerBookingsClient />
}
