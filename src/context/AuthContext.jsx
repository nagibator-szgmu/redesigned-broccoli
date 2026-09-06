import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AUTH_STATUS, GUEST_USER } from '../auth/authModel'
import { authApi } from '../api/authApi'
import { IS_DEV_MODE, DEV_USER } from '../config'

const TOKEN_KEY = 'medsim_token'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const defaultUser = IS_DEV_MODE ? DEV_USER : GUEST_USER
  const [user, setUser] = useState(defaultUser)
  const [status, setStatus] = useState(AUTH_STATUS.AUTHENTICATED)

  useEffect(() => {
    if (IS_DEV_MODE) return
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setUser(GUEST_USER)
      setStatus(AUTH_STATUS.AUTHENTICATED)
      return
    }
    authApi
      .getCurrentUser(token)
      .then((userData) => {
        setUser(userData)
        setStatus(AUTH_STATUS.AUTHENTICATED)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(GUEST_USER)
        setStatus(AUTH_STATUS.AUTHENTICATED)
      })
  }, [])

  const login = useCallback((userData, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(userData)
    setStatus(AUTH_STATUS.AUTHENTICATED)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(GUEST_USER)
    setStatus(AUTH_STATUS.AUTHENTICATED)
  }, [])

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
