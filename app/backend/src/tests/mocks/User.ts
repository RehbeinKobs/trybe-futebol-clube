export const UserMock = {
  id: 1,
  username: 'Admin',
  email: 'admin@admin.com',
  password: 'admin',
  role: 'admin',
  toJSON: () => ({
    id: 1,
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin',
  })
};