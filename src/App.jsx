import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LocaleProvider } from './locale/LocaleContext'
import { AUTH_STATUS } from './auth/authModel'
import { IS_DEV_MODE } from './config'
import LoginPage from './auth/pages/LoginPage'
import RegisterPage from './auth/pages/RegisterPage'
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage'
import MedSimApp from './MedSimApp'
import AntiTamperGuard from './components/AntiTamperGuard'

function ProtectedRoute({ children }) {
  const { status } = useAuth()
  if (status === AUTH_STATUS.LOADING) return null
  if (!IS_DEV_MODE && status === AUTH_STATUS.UNAUTHENTICATED) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { status } = useAuth()
  if (status === AUTH_STATUS.LOADING) return null
  if (!IS_DEV_MODE && status === AUTH_STATUS.AUTHENTICATED)
    return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <LocaleProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AntiTamperGuard>
                  <MedSimApp />
                </AntiTamperGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </LocaleProvider>
  )
}
