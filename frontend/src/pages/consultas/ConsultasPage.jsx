import { useState } from 'react'
import { Card, Button, Table, Modal, Form, Row, Col } from 'react-bootstrap'
import MainLayout from '../../components/layout/MainLayout'

function ConsultasPage() {
  const [pacientes] = useState([
    { id: 1, nome: 'Maria Silva' },
    { id: 2, nome: 'João Pereira' },
    { id: 3, nome: 'Fernanda Alves' },
  ])

  const [medicos] = useState([
    { id: 1, nome: 'Dr. Carlos Silva', especialidade: 'Cardiologia' },
    { id: 2, nome: 'Dra. Ana Souza', especialidade: 'Dermatologia' },
    { id: 3, nome: 'Dr. Paulo Lima', especialidade: 'Ortopedia' },
  ])

  const [consultas, setConsultas] = useState([
    {
      id: 1,
      paciente: 'Maria Silva',
      medico: 'Dr. Carlos Silva',
      especialidade: 'Cardiologia',
      data: '2026-03-25',
      horario: '09:00',
      motivo: 'Dor no peito',
    },
    {
      id: 2,
      paciente: 'João Pereira',
      medico: 'Dra. Ana Souza',
      especialidade: 'Dermatologia',
      data: '2026-03-26',
      horario: '14:30',
      motivo: 'Alergia na pele',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [novaConsulta, setNovaConsulta] = useState({
    paciente: '',
    medico: '',
    especialidade: '',
    data: '',
    horario: '',
    motivo: '',
  })

  const abrirModal = () => setShowModal(true)

  const fecharModal = () => {
    setShowModal(false)
    setNovaConsulta({
      paciente: '',
      medico: '',
      especialidade: '',
      data: '',
      horario: '',
      motivo: '',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'medico') {
      const medicoSelecionado = medicos.find((m) => m.nome === value)

      setNovaConsulta((prev) => ({
        ...prev,
        medico: value,
        especialidade: medicoSelecionado?.especialidade || '',
      }))
      return
    }

    setNovaConsulta((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCadastrarConsulta = (e) => {
    e.preventDefault()

    const consultaAdicionada = {
      id: consultas.length + 1,
      ...novaConsulta,
    }

    setConsultas((prev) => [...prev, consultaAdicionada])
    fecharModal()
  }

  const handleExcluirConsulta = (id) => {
    const novaLista = consultas.filter((consulta) => consulta.id !== id)
    setConsultas(novaLista)
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Consultas</h1>
          <p className="page-subtitle">
            Gerencie as consultas agendadas no sistema.
          </p>
        </div>

        <Button variant="primary" className="px-4" onClick={abrirModal}>
          + Nova Consulta
        </Button>
      </div>

      <Card className="content-card p-3">
        <Card.Body>
          <h4 className="fw-bold mb-3">Lista de Consultas</h4>

          <div className="table-responsive">
            <Table hover align="middle">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Especialidade</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Motivo</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {consultas.map((consulta) => (
                  <tr key={consulta.id}>
                    <td>{consulta.paciente}</td>
                    <td>{consulta.medico}</td>
                    <td>{consulta.especialidade}</td>
                    <td>{consulta.data}</td>
                    <td>{consulta.horario}</td>
                    <td>{consulta.motivo}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleExcluirConsulta(consulta.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={fecharModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agendar Consulta</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleCadastrarConsulta}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Paciente</Form.Label>
                  <Form.Select
                    name="paciente"
                    value={novaConsulta.paciente}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.nome}>
                        {paciente.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Médico</Form.Label>
                  <Form.Select
                    name="medico"
                    value={novaConsulta.medico}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um médico</option>
                    {medicos.map((medico) => (
                      <option key={medico.id} value={medico.nome}>
                        {medico.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Especialidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="especialidade"
                    value={novaConsulta.especialidade}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="data"
                    value={novaConsulta.data}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Horário</Form.Label>
                  <Form.Control
                    type="time"
                    name="horario"
                    value={novaConsulta.horario}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Motivo da Consulta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="motivo"
                    value={novaConsulta.motivo}
                    onChange={handleChange}
                    placeholder="Descreva o motivo da consulta"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default ConsultasPage