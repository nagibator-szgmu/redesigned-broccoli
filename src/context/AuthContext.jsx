import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AUTH_STATUS, EMPTY_USER } from '../auth/authModel'
import { authApi } from '../api/authApi'
import { tokenStorage } from '../storage/tokenStorage'
import { IS_DEV_MODE, DEV_USER } from '../config'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(IS_DEV_MODE ? DEV_USER : EMPTY_USER)
  const [status, setStatus] = useState(IS_DEV_MODE ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.LOADING)

  useEffect(() => {
    if (IS_DEV_MODE) return
    const token = tokenStorage.get()
    if (!token) {
      setStatus(AUTH_STATUS.UNAUTHENTICATED)
      return
    }
    authApi
      .getCurrentUser(token)
      .then((userData) => {
        setUser(userData)
        setStatus(AUTH_STATUS.AUTHENTICATED)
      })
      .catch(() => {
        tokenStorage.remove()
        setStatus(AUTH_STATUS.UNAUTHENTICATED)
      })
  }, [])

  const login = useCallback((userData, token) => {
    tokenStorage.set(token)
    setUser(userData)
    setStatus(AUTH_STATUS.AUTHENTICATED)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.remove()
    setUser(EMPTY_USER)
    setStatus(AUTH_STATUS.UNAUTHENTICATED)
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
