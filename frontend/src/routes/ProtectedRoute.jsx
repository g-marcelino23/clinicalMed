import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from 'react-bootstrap'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { authenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute