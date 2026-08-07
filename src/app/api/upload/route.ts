import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4'
]

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4']

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 })
    }

    const mimeType = (file.type || '').toLowerCase().trim()
    const rawExtension = (file.name.split('.').pop() || '').toLowerCase().trim()

    if (!ALLOWED_MIME_TYPES.includes(mimeType) && !ALLOWED_EXTENSIONS.includes(rawExtension)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file format. Only JPG, PNG, WEBP, PDF, and MP4 files are permitted.'
      }, { status: 400 })
    }

    const isVideo = mimeType.startsWith('video/') || rawExtension === 'mp4'
    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES

    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds maximum allowed limit (${isVideo ? '50MB' : '10MB'}).`
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const sanitizedExt = ALLOWED_EXTENSIONS.includes(rawExtension) ? rawExtension : (isVideo ? 'mp4' : 'jpg')
    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`

    // 1. Try saving locally if filesystem is writable
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, fileName), buffer)

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        mediaType: isVideo ? 'VIDEO' : (sanitizedExt === 'pdf' ? 'DOCUMENT' : 'IMAGE')
      })
    } catch (fsErr) {
      console.warn('Local disk write unavailable, falling back to base64 Data URL:', fsErr)
    }

    // 2. Fallback: Convert to Data URL (works 100% on Vercel serverless without disk writes)
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64Data}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      mediaType: isVideo ? 'VIDEO' : (sanitizedExt === 'pdf' ? 'DOCUMENT' : 'IMAGE')
    })

  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload processing failed due to internal error.' }, { status: 500 })
  }
}
