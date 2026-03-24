import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
      }
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
    }

    setLoading(false)
  }, [])

  const login = async (email, senha) => {
    try {
      if (!email || !senha) {
        return {
          success: false,
          message: 'Preencha e-mail e senha',
        }
      }

      const response = await api.post('/auth/login', {
        email,
        senha,
      })

      const data = response.data
      const token = data.token
      const usuario = data.usuario || data.user

      if (!token || !usuario) {
        return {
          success: false,
          message: 'Resposta inválida do servidor',
        }
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      setUser(usuario)

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'E-mail ou senha inválidos'

      return {
        success: false,
        message: mensagem,
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}