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
    return NextResponse.json({
      success: true,
      settings: { whatsapp_number: '01070657476' }
    })
  }
}
