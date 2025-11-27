export function getPermissionColor(
  permission: string
): 'success' | 'warning' | 'error' | 'default' {
  if (permission.startsWith('ADD_')) return 'success';
  if (permission.startsWith('UPDATE_')) return 'warning';
  if (permission.startsWith('DELETE_')) return 'error';
  return 'default';
}
