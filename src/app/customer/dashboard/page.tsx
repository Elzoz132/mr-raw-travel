import { CustomerDashboardClient } from '@/components/customer/CustomerDashboardClient'

export const metadata = {
  title: 'My VIP Dashboard | Mr.Raw Travel',
  description: 'Manage your excursion bookings, vouchers, verified customer reviews, and wishlist.'
}

export default function CustomerDashboardPage() {
  return <CustomerDashboardClient />
}
