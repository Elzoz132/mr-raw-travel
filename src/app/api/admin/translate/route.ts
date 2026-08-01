import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { text, targetLang = 'en' } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 })
    }

    // Call Google Translate GTX API
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(googleUrl)

    if (!res.ok) {
      return NextResponse.json({ success: false, translatedText: text })
    }

    const data = await res.json()
    let translatedText = text

    if (Array.isArray(data) && Array.isArray(data[0])) {
      translatedText = data[0].map((item: any) => item[0]).join('')
    }

    return NextResponse.json({ success: true, translatedText })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ success: false, translatedText: '' })
  }
}
