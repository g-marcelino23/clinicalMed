import { Card, Col, Row, Badge } from 'react-bootstrap'
import MainLayout from '../../components/layout/MainLayout'
import { useAuth } from '../../context/AuthContext'
import { FaUserInjured, FaCalendarCheck, FaFlask, FaBell } from 'react-icons/fa'

function DashboardPage() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div className="dashboard-header mb-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Bem-vindo de volta, {user?.nome || 'Gabriel'}.
          </p>
        </div>

        <div>
          <Badge bg="primary" className="px-3 py-2 rounded-pill">
            {user?.perfil || 'SECRETARIO'}
          </Badge>
        </div>
      </div>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="stat-card dashboard-stat-card stat-blue">
            <Card.Body>
              <div className="stat-icon">
                <FaUserInjured />
              </div>
              <h6 className="mt-3">Pacientes</h6>
              <h2 className="fw-bold">128</h2>
              <p className="text-muted mb-0">Pacientes cadastrados</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card dashboard-stat-card stat-green">
            <Card.Body>
              <div className="stat-icon">
                <FaCalendarCheck />
              </div>
              <h6 className="mt-3">Consultas</h6>
              <h2 className="fw-bold">42</h2>
              <p className="text-muted mb-0">Consultas hoje</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card dashboard-stat-card stat-yellow">
            <Card.Body>
              <div className="stat-icon">
                <FaFlask />
              </div>
              <h6 className="mt-3">Exames</h6>
              <h2 className="fw-bold">17</h2>
              <p className="text-muted mb-0">Exames pendentes</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card dashboard-stat-card stat-red">
            <Card.Body>
              <div className="stat-icon">
                <FaBell />
              </div>
              <h6 className="mt-3">Alertas</h6>
              <h2 className="fw-bold">5</h2>
              <p className="text-muted mb-0">Notificações importantes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-2">
        <Col md={8}>
          <Card className="content-card p-4">
            <h4 className="fw-bold mb-3">Visão Geral</h4>
            <p className="text-muted">
              O Clinical Med centraliza o gerenciamento da clínica em uma única
              plataforma, permitindo controlar pacientes, médicos, consultas,
              exames e horários.
            </p>
            <p className="mb-0 text-muted">
              Futuramente, esta área poderá exibir gráficos, relatórios,
              indicadores de desempenho e movimentações recentes do sistema.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="content-card p-4">
            <h4 className="fw-bold mb-3">Perfil do Usuário</h4>
            <p className="mb-2">
              <strong>Nome:</strong> {user?.nome || 'Gabriel'}
            </p>
            <p className="mb-2">
              <strong>E-mail:</strong> {user?.email || 'gabriel@email.com'}
            </p>
            <p className="mb-0">
              <strong>Perfil:</strong> {user?.perfil || 'SECRETARIO'}
            </p>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  )
}

export default DashboardPage