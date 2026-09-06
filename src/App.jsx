import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LocaleProvider } from './locale/LocaleContext'
import LoginPage from './auth/pages/LoginPage'
import RegisterPage from './auth/pages/RegisterPage'
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage'
import MedSimApp from './MedSimApp'
import AntiTamperGuard from './components/AntiTamperGuard'

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AntiTamperGuard>
                  <MedSimApp />
                </AntiTamperGuard>
              }
            />
            <Route
              path="/app"
              element={
                <AntiTamperGuard>
                  <MedSimApp />
                </AntiTamperGuard>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </LocaleProvider>
  )
}
