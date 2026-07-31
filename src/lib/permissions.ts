export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_EDITOR' | 'CUSTOMER_SUPPORT' | 'CUSTOMER'

export type Resource =
  | 'TRIPS'
  | 'PACKAGES'
  | 'BOOKINGS'
  | 'CUSTOMERS'
  | 'GALLERY'
  | 'REVIEWS'
  | 'BLOG'
  | 'COUPONS'
  | 'PAYMENTS'
  | 'ANALYTICS'
  | 'SETTINGS'
  | 'USERS'

export type PermissionAction = 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove'

export interface RolePermissionRule {
  resource: Resource
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canApprove: boolean
}

// Default Enterprise Permission Matrix Definitions
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Record<Resource, RolePermissionRule>> = {
  SUPER_ADMIN: {
    TRIPS: { resource: 'TRIPS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    PACKAGES: { resource: 'PACKAGES', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    BOOKINGS: { resource: 'BOOKINGS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    CUSTOMERS: { resource: 'CUSTOMERS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    GALLERY: { resource: 'GALLERY', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    REVIEWS: { resource: 'REVIEWS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    BLOG: { resource: 'BLOG', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    COUPONS: { resource: 'COUPONS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    PAYMENTS: { resource: 'PAYMENTS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    ANALYTICS: { resource: 'ANALYTICS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    SETTINGS: { resource: 'SETTINGS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    USERS: { resource: 'USERS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }
  },
  ADMIN: {
    TRIPS: { resource: 'TRIPS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    PACKAGES: { resource: 'PACKAGES', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    BOOKINGS: { resource: 'BOOKINGS', canView: true, canCreate: false, canEdit: true, canDelete: true, canApprove: true },
    CUSTOMERS: { resource: 'CUSTOMERS', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: false },
    GALLERY: { resource: 'GALLERY', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    REVIEWS: { resource: 'REVIEWS', canView: true, canCreate: false, canEdit: true, canDelete: true, canApprove: true },
    BLOG: { resource: 'BLOG', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    COUPONS: { resource: 'COUPONS', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    PAYMENTS: { resource: 'PAYMENTS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ANALYTICS: { resource: 'ANALYTICS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    SETTINGS: { resource: 'SETTINGS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    USERS: { resource: 'USERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
  },
  CONTENT_EDITOR: {
    TRIPS: { resource: 'TRIPS', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: false },
    PACKAGES: { resource: 'PACKAGES', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: false },
    BOOKINGS: { resource: 'BOOKINGS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    CUSTOMERS: { resource: 'CUSTOMERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    GALLERY: { resource: 'GALLERY', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    REVIEWS: { resource: 'REVIEWS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    BLOG: { resource: 'BLOG', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    COUPONS: { resource: 'COUPONS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    PAYMENTS: { resource: 'PAYMENTS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ANALYTICS: { resource: 'ANALYTICS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    SETTINGS: { resource: 'SETTINGS', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: false },
    USERS: { resource: 'USERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
  },
  CUSTOMER_SUPPORT: {
    TRIPS: { resource: 'TRIPS', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    PACKAGES: { resource: 'PACKAGES', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    BOOKINGS: { resource: 'BOOKINGS', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: true },
    CUSTOMERS: { resource: 'CUSTOMERS', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    GALLERY: { resource: 'GALLERY', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    REVIEWS: { resource: 'REVIEWS', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    BLOG: { resource: 'BLOG', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    COUPONS: { resource: 'COUPONS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    PAYMENTS: { resource: 'PAYMENTS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ANALYTICS: { resource: 'ANALYTICS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    SETTINGS: { resource: 'SETTINGS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    USERS: { resource: 'USERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
  },
  CUSTOMER: {
    TRIPS: { resource: 'TRIPS', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    PACKAGES: { resource: 'PACKAGES', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    BOOKINGS: { resource: 'BOOKINGS', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false },
    CUSTOMERS: { resource: 'CUSTOMERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    GALLERY: { resource: 'GALLERY', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    REVIEWS: { resource: 'REVIEWS', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false },
    BLOG: { resource: 'BLOG', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    COUPONS: { resource: 'COUPONS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    PAYMENTS: { resource: 'PAYMENTS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ANALYTICS: { resource: 'ANALYTICS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    SETTINGS: { resource: 'SETTINGS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    USERS: { resource: 'USERS', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
  }
}

export function isAllowed(role: string, resource: Resource, action: PermissionAction = 'canView'): boolean {
  const roleKey = (role || 'CUSTOMER') as UserRole
  if (roleKey === 'SUPER_ADMIN') return true

  const matrix = DEFAULT_ROLE_PERMISSIONS[roleKey] || DEFAULT_ROLE_PERMISSIONS.CUSTOMER
  const rule = matrix[resource]
  return rule ? Boolean(rule[action]) : false
}
