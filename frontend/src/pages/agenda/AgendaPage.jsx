import { Card, Row, Col, Badge } from 'react-bootstrap'
import MainLayout from '../../components/layout/MainLayout'

function AgendaPage() {
  const agendaMedicos = [
    {
      id: 1,
      medico: 'Dr. Carlos Silva',
      especialidade: 'Cardiologia',
      horarios: [
        { hora: '08:00', status: 'Disponível' },
        { hora: '09:00', status: 'Ocupado' },
        { hora: '10:00', status: 'Disponível' },
        { hora: '11:00', status: 'Ocupado' },
      ],
    },
    {
      id: 2,
      medico: 'Dra. Ana Souza',
      especialidade: 'Dermatologia',
      horarios: [
        { hora: '08:30', status: 'Disponível' },
        { hora: '09:30', status: 'Disponível' },
        { hora: '10:30', status: 'Ocupado' },
        { hora: '11:30', status: 'Disponível' },
      ],
    },
    {
      id: 3,
      medico: 'Dr. Paulo Lima',
      especialidade: 'Ortopedia',
      horarios: [
        { hora: '13:00', status: 'Ocupado' },
        { hora: '14:00', status: 'Disponível' },
        { hora: '15:00', status: 'Disponível' },
        { hora: '16:00', status: 'Ocupado' },
      ],
    },
  ]

  const getBadgeVariant = (status) => {
    if (status === 'Disponível') return 'success'
    if (status === 'Ocupado') return 'danger'
    return 'secondary'
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="page-title">Agenda</h1>
        <p className="page-subtitle">
          Visualize os horários dos médicos da clínica.
        </p>
      </div>

      <Row className="g-4">
        {agendaMedicos.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card className="content-card h-100 p-3">
              <Card.Body>
                <div className="mb-4">
                  <h4 className="fw-bold mb-1">{item.medico}</h4>
                  <p className="text-muted mb-0">{item.especialidade}</p>
                </div>

                <div className="d-flex flex-column gap-3">
                  {item.horarios.map((horario, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center p-3 rounded-4"
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <span className="fw-semibold">{horario.hora}</span>
                      <Badge bg={getBadgeVariant(horario.status)} pill>
                        {horario.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </MainLayout>
  )
}

export default AgendaPage