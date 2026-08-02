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
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'

export default function RegisterPage() {
  const C = useTheme()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      const data = await authApi.register({ email, username, password })
      login(data.user, data.access_token)
      navigate('/app')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthTitle subtitle="Регистрация" />
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        onSubmit={handleSubmit}
      >
        <AuthField
          label="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
        <AuthField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <AuthField
          label="Повторите пароль"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
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
          {loading ? 'Создание...' : 'Создать аккаунт'}
        </Btn>
      </form>
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 13,
          color: C.textDim,
          fontFamily: FONT,
        }}
      >
        <AuthLink to="/">Уже есть аккаунт</AuthLink>
      </div>
    </AuthLayout>
  )
}
