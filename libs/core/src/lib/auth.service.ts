export interface AuthUser { id: string; roles: string[]; permissions: string[]; }
let currentUser: AuthUser | null = null;
export function setCurrentUser(user: AuthUser | null): void { currentUser = user; }
export function getCurrentUser(): AuthUser | null { return currentUser; }
export function hasPermission(permission: string): boolean { if (!currentUser) return false; return currentUser.permissions.includes(permission); }
