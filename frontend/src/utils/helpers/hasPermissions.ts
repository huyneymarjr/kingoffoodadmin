export function hasPermission(requiredPermissions: string[], userPermissions: string[]) {
  return requiredPermissions.some((permission) => userPermissions?.includes(permission));
}
