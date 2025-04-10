// Authentication utility functions

// Store the JWT token securely in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem("auth_token", token)
}

// Retrieve the JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("auth_token")
}

// Remove the JWT token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem("auth_token")
}

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token
}

// Get the authorization header for API requests
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Parse the JWT token to get user information
export const parseToken = (): any | null => {
  const token = getToken()
  if (!token) return null

  try {
    // Split the token and get the payload
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing token:", error)
    return null
  }
}

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const payload = parseToken()
  if (!payload || !payload.exp) return true

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now()
}
