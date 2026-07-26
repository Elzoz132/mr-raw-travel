import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settingsList = await prisma.settings.findMany()
    const settingsMap: Record<string, string> = {}
    
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    if (!settingsMap.whatsapp_number) {
      settingsMap.whatsapp_number = '01070657476'
    }

    return NextResponse.json({ success: true, settings: settingsMap })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'Key and value are required.' }, { status: 400 })
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })

    return NextResponse.json({ success: true, setting })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
