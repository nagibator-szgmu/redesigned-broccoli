import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout, {
  AuthField,
  AuthLink,
  AuthTitle,
} from '../components/AuthLayout'
import { Btn } from '../../ui/components'
import { FONT } from '../../ui/theme'
import { useTheme } from '../../ui/ThemeContext'
import { authApi } from '../../api/authApi'

export default function ForgotPasswordPage() {
  const C = useTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFindUser = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem('medsim_users') || '[]')
      const found = users.find((u) => u.email === email)
      if (!found) {
        setError('Пользователь с таким email не найден')
        setLoading(false)
        return
      }
      setStep(2)
    } catch {
      setError('Ошибка при поиске пользователя')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 4) {
      setError('Пароль должен быть не менее 4 символов')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword({ email, newPassword })
      setSuccess('Пароль успешно изменён! Теперь войдите с новым паролем.')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthTitle subtitle="Восстановление пароля" />
      {step === 1 ? (
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          onSubmit={handleFindUser}
        >
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, lineHeight: 1.6 }}>
            Введите email, указанный при регистрации. Мы найдём ваш аккаунт и позволим задать новый пароль.
          </div>
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
          {error && (
            <div
              style={{
                background: `${C.red}15`,
                border: `1px solid ${C.red}44`,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: C.red,
                fontFamily: FONT,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}
          <Btn style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Поиск...' : 'Найти аккаунт'}
          </Btn>
        </form>
      ) : (
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          onSubmit={handleResetPassword}
        >
          <div style={{ fontSize: 12, color: C.green, fontFamily: FONT, lineHeight: 1.6, background: `${C.green}15`, border: `1px solid ${C.green}44`, borderRadius: 8, padding: '8px 12px' }}>
            Аккаунт найден! Задайте новый пароль.
          </div>
          <AuthField
            label="Новый пароль"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Минимум 4 символа"
          />
          <AuthField
            label="Повторите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ещё раз"
          />
          {error && (
            <div
              style={{
                background: `${C.red}15`,
                border: `1px solid ${C.red}44`,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: C.red,
                fontFamily: FONT,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                background: `${C.green}15`,
                border: `1px solid ${C.green}44`,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: C.green,
                fontFamily: FONT,
                lineHeight: 1.5,
              }}
            >
              {success}
            </div>
          )}
          <Btn style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить новый пароль'}
          </Btn>
        </form>
      )}
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 13,
          color: C.textDim,
          fontFamily: FONT,
        }}
      >
        <AuthLink to="/">Вернуться к входу</AuthLink>
      </div>
    </AuthLayout>
  )
}
