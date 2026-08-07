import { NextResponse } from 'next/server'
import { runSeedScript } from '@/lib/seedHelper'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await runSeedScript()
    return NextResponse.json({
      success: true,
      message: 'Real Mr.Raw Travel packages, Social links, & Addons successfully seeded into database!'
    })
  } catch (error: any) {
    console.error('Error seeding real packages:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
