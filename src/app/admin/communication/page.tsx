import React from 'react'
import { AdminCommunicationClient } from '@/components/admin/AdminCommunicationClient'

export const metadata = {
  title: 'Communication Center & Email Templates | Admin Dashboard',
  description: 'Manage email branding, subjects, template toggles, and send test emails via Resend'
}

export default function AdminCommunicationPage() {
  return <AdminCommunicationClient />
}
