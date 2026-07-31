import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const isVideo = file.type.startsWith('video/')
    const extension = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), buffer)

    const publicUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaType: isVideo ? 'VIDEO' : 'IMAGE'
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Upload processing failed' }, { status: 500 })
  }
}
