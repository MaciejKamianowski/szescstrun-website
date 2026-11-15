import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const isAdmin = (user?: User | null): boolean => user?.role === 'admin'

export const isEditor = (user?: User | null): boolean =>
  user?.role === 'editor' || user?.role === 'admin'

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const admins: Access = ({ req: { user } }) => isAdmin(user as User | null)

export const adminsAndEditors: Access = ({ req: { user } }) => isEditor(user as User | null)

export const anyone: Access = () => true

export const adminsField: FieldAccess = ({ req: { user } }) => isAdmin(user as User | null)

export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
