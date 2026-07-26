import QRCode from 'qrcode'

export async function generateQRCodeDataURL(token: string): Promise<string> {
  try {
    return await QRCode.toDataURL(token, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
  } catch (err) {
    console.error('Error generating QR code:', err)
    return ''
  }
}
