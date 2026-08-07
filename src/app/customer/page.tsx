import { CustomerBookingsClient } from '@/components/customer/CustomerBookingsClient'

export const metadata = {
  title: 'Customer Dashboard | Mr.Raw Travel',
  description: 'View and manage all your booked excursions and account details.'
}

export default function CustomerDashboardPage() {
  return <CustomerBookingsClient />
}
