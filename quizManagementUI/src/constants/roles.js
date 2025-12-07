// User Roles Constants
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Role permissions
export const PERMISSIONS = {
  [ROLES.USER]: [
    'view_quizzes',
    'take_quiz',
    'view_results'
  ],
  [ROLES.ADMIN]: [
    'view_quizzes',
    'take_quiz',
    'view_results',
    'create_quiz',
    'manage_quizzes'
  ]
};

// Check if role has permission
export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

// Check if role is admin
export const isAdminRole = (role) => {
  return role === ROLES.ADMIN;
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.USER]: 'User',
    [ROLES.ADMIN]: 'Administrator'
  };
  return roleNames[role] || 'Unknown';
};

