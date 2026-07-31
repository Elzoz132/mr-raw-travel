import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEFAULT_GATEWAYS = [
  { key: 'STRIPE', name: 'Stripe Credit / Debit Card', isEnabled: true, instructionsEn: 'Pay securely with Visa, Mastercard, or Apple Pay.' },
  { key: 'PAYMOB', name: 'Paymob Egypt Cards & Wallets', isEnabled: true, instructionsEn: 'Pay using local Egyptian cards, Meeza, and mobile wallets.' },
  { key: 'PAYPAL', name: 'PayPal Express Checkout', isEnabled: true, instructionsEn: 'Pay instantly with your PayPal balance or linked cards.' },
  { key: 'VODAFONE_CASH', name: 'Vodafone Cash Mobile Wallet', isEnabled: true, instructionsAr: 'حول المبلغ إلى رقم فودافون كاش: 01070657476 وأرفق سكرينشوت.' },
  { key: 'INSTAPAY', name: 'InstaPay Egypt Direct Transfer', isEnabled: true, instructionsAr: 'تحويل مباشر عبر إنستا باي إلى IPA: mrraw@instapay' },
  { key: 'CASH', name: 'Cash on Arrival / Bus Pickup', isEnabled: true, instructionsEn: 'Pay cash in USD, EUR, EGP, or GBP to your driver upon pickup.' }
]

export async function GET() {
  try {
    let gateways = await prisma.paymentGateway.findMany()
    if (gateways.length === 0) {
      // Seed defaults
      for (const g of DEFAULT_GATEWAYS) {
        await prisma.paymentGateway.upsert({
          where: { key: g.key },
          update: {},
          create: g
        })
      }
      gateways = await prisma.paymentGateway.findMany()
    }
    return NextResponse.json({ success: true, gateways })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, isEnabled, instructionsEn, instructionsAr, instructionsDe } = body

    const gateway = await prisma.paymentGateway.upsert({
      where: { key },
      update: { isEnabled, instructionsEn, instructionsAr, instructionsDe },
      create: { key, name: key, isEnabled, instructionsEn, instructionsAr, instructionsDe }
    })

    return NextResponse.json({ success: true, gateway })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
