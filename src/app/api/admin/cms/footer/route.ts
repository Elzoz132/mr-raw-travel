import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getFooterConfig, updateFooterConfig } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getFooterConfig()
    return NextResponse.json({ success: true, config })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch footer config' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updated = await updateFooterConfig(body)
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, config: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update footer config' }, { status: 500 })
  }
}
