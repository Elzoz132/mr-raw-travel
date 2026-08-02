import { NextResponse } from 'next/server'
import { prisma, withDbRetry } from '@/lib/db'

const DEFAULT_GATEWAYS = [
  {
    key: 'VODAFONE_CASH',
    name: 'Vodafone Cash Mobile Wallet (فودافون كاش)',
    isEnabled: true,
    instructionsAr: 'تحويل إلى رقم فودافون كاش: 01022392428'
  },
  {
    key: 'INSTAPAY',
    name: 'InstaPay Direct Transfer (إنستا باي)',
    isEnabled: true,
    instructionsAr: 'تحويل مباشر عبر إنستا باي إلى IPA: mrraw@instapay'
  },
  {
    key: 'BANK_TRANSFER',
    name: 'Bank Wire Transfer (حساب بنكي)',
    isEnabled: true,
    instructionsAr: 'تحويل بنكي مباشر لحساب الشركة البنكي'
  },
  { key: 'STRIPE', name: 'Stripe Credit / Debit Card', isEnabled: true, instructionsEn: 'Pay securely with Visa, Mastercard, or Apple Pay.' },
  { key: 'PAYMOB', name: 'Paymob Egypt Cards & Wallets', isEnabled: true, instructionsEn: 'Pay using local Egyptian cards, Meeza, and mobile wallets.' },
  { key: 'PAYPAL', name: 'PayPal Express Checkout', isEnabled: true, instructionsEn: 'Pay instantly with your PayPal balance or linked cards.' },
  { key: 'CASH', name: 'Cash on Arrival / Bus Pickup', isEnabled: true, instructionsEn: 'Pay cash in USD, EUR, EGP, or GBP to your driver upon pickup.' }
]

export async function GET() {
  try {
    let gateways = await withDbRetry(() => prisma.paymentGateway.findMany())
    if (gateways.length === 0) {
      // Seed defaults
      for (const g of DEFAULT_GATEWAYS) {
        await withDbRetry(() =>
          prisma.paymentGateway.upsert({
            where: { key: g.key },
            update: {},
            create: g
          })
        )
      }
      gateways = await withDbRetry(() => prisma.paymentGateway.findMany())
    }

    // Attach parsed details from settings table
    const settingsList = await withDbRetry(() => prisma.settings.findMany())
    const settingsMap: Record<string, string> = {}
    settingsList.forEach((s: any) => { settingsMap[s.key] = s.value })

    const formattedGateways = gateways.map((gt: any) => {
      let detailsObj: any = {}

      if (gt.key === 'VODAFONE_CASH') {
        detailsObj = {
          phoneNumber: settingsMap.vodafone_cash_number || '01022392428',
          accountName: settingsMap.vodafone_cash_name || 'Mr.Raw Travel'
        }
      } else if (gt.key === 'INSTAPAY') {
        detailsObj = {
          accountName: settingsMap.instapay_account_name || 'Mr.Raw Luxury Travel',
          username: settingsMap.instapay_username || 'mrraw@instapay',
          phoneNumber: settingsMap.instapay_phone_number || '01022392428'
        }
      } else if (gt.key === 'BANK_TRANSFER') {
        detailsObj = {
          bankName: settingsMap.bank_name || 'البنك الأهلي المصري (National Bank of Egypt)',
          accountHolder: settingsMap.bank_account_holder || 'Mr.Raw Luxury Travel',
          accountNumber: settingsMap.bank_account_number || '1234567890123456',
          iban: settingsMap.bank_iban || 'EG380002000100001234567890123',
          swiftCode: settingsMap.bank_swift_code || 'NBEGEGCX'
        }
      }

      return {
        ...gt,
        details: detailsObj
      }
    })

    return NextResponse.json({ success: true, gateways: formattedGateways })
  } catch (error: any) {
    console.error('Error fetching payment gateways:', error)
    return NextResponse.json({ success: true, gateways: DEFAULT_GATEWAYS })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, name, isEnabled, instructionsEn, instructionsAr, instructionsDe, details } = body

    const gateway = await withDbRetry(() =>
      prisma.paymentGateway.upsert({
        where: { key },
        update: {
          name: name || key,
          isEnabled: isEnabled !== undefined ? isEnabled : true,
          instructionsEn,
          instructionsAr,
          instructionsDe
        },
        create: {
          key,
          name: name || key,
          isEnabled: isEnabled !== undefined ? isEnabled : true,
          instructionsEn,
          instructionsAr,
          instructionsDe
        }
      })
    )

    // Sync details fields into Settings table reliably
    try {
      if (details) {
        const parsed = typeof details === 'string' ? JSON.parse(details) : details
        if (key === 'VODAFONE_CASH') {
          if (parsed.phoneNumber !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'vodafone_cash_number' }, update: { value: parsed.phoneNumber }, create: { key: 'vodafone_cash_number', value: parsed.phoneNumber } }))
          if (parsed.accountName !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'vodafone_cash_name' }, update: { value: parsed.accountName }, create: { key: 'vodafone_cash_name', value: parsed.accountName } }))
        }
        if (key === 'INSTAPAY') {
          if (parsed.accountName !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'instapay_account_name' }, update: { value: parsed.accountName }, create: { key: 'instapay_account_name', value: parsed.accountName } }))
          if (parsed.username !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'instapay_username' }, update: { value: parsed.username }, create: { key: 'instapay_username', value: parsed.username } }))
          if (parsed.phoneNumber !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'instapay_phone_number' }, update: { value: parsed.phoneNumber }, create: { key: 'instapay_phone_number', value: parsed.phoneNumber } }))
        }
        if (key === 'BANK_TRANSFER') {
          if (parsed.bankName !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'bank_name' }, update: { value: parsed.bankName }, create: { key: 'bank_name', value: parsed.bankName } }))
          if (parsed.accountHolder !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'bank_account_holder' }, update: { value: parsed.accountHolder }, create: { key: 'bank_account_holder', value: parsed.accountHolder } }))
          if (parsed.accountNumber !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'bank_account_number' }, update: { value: parsed.accountNumber }, create: { key: 'bank_account_number', value: parsed.accountNumber } }))
          if (parsed.iban !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'bank_iban' }, update: { value: parsed.iban }, create: { key: 'bank_iban', value: parsed.iban } }))
          if (parsed.swiftCode !== undefined) await withDbRetry(() => prisma.settings.upsert({ where: { key: 'bank_swift_code' }, update: { value: parsed.swiftCode }, create: { key: 'bank_swift_code', value: parsed.swiftCode } }))
        }
      }
    } catch (e) {}

    return NextResponse.json({ success: true, gateway })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
