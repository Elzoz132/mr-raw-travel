export async function uploadMedia(file: File | string, folder = 'mr-raw-travel'): Promise<{ url: string; mediaType: 'IMAGE' | 'VIDEO' }> {
  // Check if Cloudinary credentials are configured
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'

  if (typeof file === 'string' && file.startsWith('http')) {
    const isVideo = file.match(/\.(mp4|webm|ogg|mov)$/i) !== null
    return { url: file, mediaType: isVideo ? 'VIDEO' : 'IMAGE' }
  }

  if (cloudName) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', folder)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        return {
          url: data.secure_url,
          mediaType: data.resource_type === 'video' ? 'VIDEO' : 'IMAGE'
        }
      }
    } catch (err) {
      console.warn('Cloudinary direct upload failed, falling back to local API handler:', err)
    }
  }

  // Fallback upload via server API
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    throw new Error('Upload failed')
  }

  const data = await res.json()
  return {
    url: data.url,
    mediaType: data.mediaType || 'IMAGE'
  }
}
