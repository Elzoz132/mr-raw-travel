import { NextResponse } from 'next/server'
import { prisma, withDbRetry } from '@/lib/db'
import { sendEmail, EmailTemplateKey, getEmailBranding } from '@/lib/email/resend'

export async function GET() {
  try {
    const settingsList = await withDbRetry(() => prisma.settings.findMany())
    const settingsMap: Record<string, string> = {}
    settingsList.forEach((s: any) => { settingsMap[s.key] = s.value })

    const logs = await withDbRetry(() =>
      prisma.emailLog.findMany({
        take: 50,
        orderBy: { sentAt: 'desc' }
      })
    )

    const branding = await getEmailBranding()

    return NextResponse.json({
      success: true,
      branding,
      settings: settingsMap,
      logs
    })
  } catch (error: any) {
    console.error('Error fetching admin communication settings:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, settings, testEmail, testTemplateKey } = body

    if (action === 'SAVE_SETTINGS' && settings) {
      for (const [key, value] of Object.entries(settings)) {
        await withDbRetry(() =>
          prisma.settings.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
          })
        )
      }
      return NextResponse.json({ success: true, message: 'Email branding & communication settings saved successfully!' })
    }

    if (action === 'SEND_TEST_EMAIL') {
      if (!testEmail) {
        return NextResponse.json({ success: false, error: 'Target email address is required' }, { status: 400 })
      }

      const key: EmailTemplateKey = testTemplateKey || 'WELCOME'
      const sampleProps: Record<string, any> = {
        name: 'VIP Guest',
        verifyUrl: 'https://mrrawtravel.com/auth/verify?token=TEST_SAMPLE_TOKEN',
        resetUrl: 'https://mrrawtravel.com/auth/reset-password?token=TEST_SAMPLE_TOKEN',
        bookingNumber: 'MR-2026-9999',
        tripTitle: 'VIP Private Luxury Yacht Charter',
        date: 'Tomorrow at 09:00 AM',
        amount: '$450.00',
        voucherUrl: 'https://mrrawtravel.com/customer/dashboard'
      }

      const result = await sendEmail({
        to: testEmail,
        templateKey: key,
        props: sampleProps
      })

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Test Email [${key}] dispatched successfully to ${testEmail}!`
          : `Email dispatch error: ${result.error || 'Check Resend credentials'}`,
        status: result.status,
        error: result.error
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in /api/admin/communication:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
