import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/audit'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (role && role !== 'ALL') where.role = role
    if (status && status !== 'ALL') where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        country: true,
        lastLoginAt: true,
        createdAt: true,
        isTwoFactorEnabled: true
      }
    })

    return NextResponse.json({ success: true, users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role = 'ADMIN', phone, status = 'ACTIVE' } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password || 'MrRaw2026!VIP',
        role,
        status,
        phone
      }
    })

    // Log permanent activity
    await logActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: 'SUPER_ADMIN',
      action: 'CREATE_USER',
      resource: 'USERS',
      details: `Created new user ${user.email} with role ${role}`,
      req
    })

    // Create Admin Notification
    await prisma.adminNotification.create({
      data: {
        title: 'New User Account Created',
        message: `${name} (${email}) has been added as ${role}`,
        type: 'USER_CREATED'
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, role, status, phone, password } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(status && { status }),
        ...(phone && { phone }),
        ...(password && { password })
      }
    })

    await logActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: 'SUPER_ADMIN',
      action: 'UPDATE_USER',
      resource: 'USERS',
      details: `Updated user ${user.email} role to ${role} and status to ${status}`,
      req
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Log permanent activity BEFORE delete
    await logActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: 'SUPER_ADMIN',
      action: 'DELETE_USER',
      resource: 'USERS',
      details: `Permanently deleted user account ${user.email} (${user.role})`,
      req
    })

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
