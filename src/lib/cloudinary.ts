export async function uploadMedia(
  file: File | string,
  folder = 'mr-raw-travel'
): Promise<{ url: string; mediaType: 'IMAGE' | 'VIDEO' }> {
  // If already a URL or Data URL, return directly
  if (typeof file === 'string') {
    const isVideo = file.match(/\.(mp4|webm|ogg|mov)$/i) !== null || file.startsWith('data:video')
    return { url: file, mediaType: isVideo ? 'VIDEO' : 'IMAGE' }
  }

  // 1. Try server API upload (/api/upload)
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const data = await res.json()
      if (data.url) {
        return {
          url: data.url,
          mediaType: data.mediaType || 'IMAGE'
        }
      }
    }
  } catch (err) {
    console.warn('Server upload API failed, using FileReader fallback:', err)
  }

  // 2. Client-side FileReader Base64 fallback (works 100% offline & without server permissions!)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      const isVideo = file.type.startsWith('video/')
      resolve({ url, mediaType: isVideo ? 'VIDEO' : 'IMAGE' })
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}
