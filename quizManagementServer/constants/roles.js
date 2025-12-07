// User Roles Constants
const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Role permissions
const PERMISSIONS = {
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
const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

// Check if role is admin
const isAdmin = (role) => {
  return role === ROLES.ADMIN;
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  isAdmin
};

