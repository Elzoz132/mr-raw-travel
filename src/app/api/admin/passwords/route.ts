import { NextResponse } from 'next/server'
import { getAdminPasswords, saveAdminPasswords } from '@/lib/adminAuth'

export async function GET() {
  try {
    const passwords = await getAdminPasswords()
    return NextResponse.json({ success: true, passwords })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json()
    if (!newPassword || newPassword.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Password must be at least 3 characters long.' }, { status: 400 })
    }

    const currentPasswords = await getAdminPasswords()
    if (currentPasswords.includes(newPassword.trim())) {
      return NextResponse.json({ success: false, error: 'Password already exists.' }, { status: 400 })
    }

    currentPasswords.push(newPassword.trim())
    const updated = await saveAdminPasswords(currentPasswords)

    return NextResponse.json({ success: true, passwords: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json()
    if (!oldPassword || !newPassword || newPassword.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Both old and new passwords are required.' }, { status: 400 })
    }

    const currentPasswords = await getAdminPasswords()
    const index = currentPasswords.indexOf(oldPassword)
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Old password not found.' }, { status: 404 })
    }

    currentPasswords[index] = newPassword.trim()
    const updated = await saveAdminPasswords(currentPasswords)

    return NextResponse.json({ success: true, passwords: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const target = searchParams.get('password')

    if (!target) {
      return NextResponse.json({ success: false, error: 'Password parameter is required.' }, { status: 400 })
    }

    const currentPasswords = await getAdminPasswords()
    if (currentPasswords.length <= 1) {
      return NextResponse.json({ success: false, error: 'Cannot delete the last remaining admin password.' }, { status: 400 })
    }

    const filtered = currentPasswords.filter((p) => p !== target)
    const updated = await saveAdminPasswords(filtered)

    return NextResponse.json({ success: true, passwords: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
