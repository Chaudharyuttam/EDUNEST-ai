export const saveAuthToken = (user) => {
  const payload = {
    sub: user.email,
    name: user.name || 'Student',
    role: user.role || 'student',
    iat: Date.now(),
  }

  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.signature`
  localStorage.setItem('authToken', token)
  return token
}

export const getAuthToken = () => localStorage.getItem('authToken')

export const clearAuthToken = () => localStorage.removeItem('authToken')

export const isAuthenticated = () => Boolean(getAuthToken())
