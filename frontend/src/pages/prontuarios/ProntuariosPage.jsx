import { useEffect, useMemo, useState } from 'react'
import { Modal, Button, Form, Table, Card, Row, Col, Badge } from 'react-bootstrap'
import { FaNotesMedical, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import api from '../../services/api'

function ProntuariosPage() {
  const [prontuarios, setProntuarios] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [busca, setBusca] = useState('')

  const [formData, setFormData] = useState({
    id: null,
    pacienteId: '',
    medicoId: '',
    data: '',
    descricao: '',
    diagnostico: '',
    prescricao: '',
    observacoes: '',
  })

  const carregarDados = async () => {
    try {
      setLoading(true)

      const [resProntuarios, resPacientes, resMedicos] = await Promise.all([
        api.get('/prontuarios'),
        api.get('/pacientes'),
        api.get('/medicos'),
      ])

      setProntuarios(Array.isArray(resProntuarios.data) ? resProntuarios.data : [])
      setPacientes(Array.isArray(resPacientes.data) ? resPacientes.data : [])
      setMedicos(Array.isArray(resMedicos.data) ? resMedicos.data : [])
    } catch (error) {
      console.error('Erro ao carregar prontuários:', error)
      alert('Erro ao carregar os dados dos prontuários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const getPacienteNome = (pacienteId) => {
    const paciente = pacientes.find((item) => item.id === Number(pacienteId))
    return paciente ? paciente.nome : 'Não informado'
  }

  const getMedicoNome = (medicoId) => {
    const medico = medicos.find((item) => item.id === Number(medicoId))
    return medico ? medico.nome : 'Não informado'
  }

  const prontuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase()

    return prontuarios.filter((prontuario) => {
      const pacienteNome = getPacienteNome(prontuario.pacienteId).toLowerCase()
      const medicoNome = getMedicoNome(prontuario.medicoId).toLowerCase()

      return (
        pacienteNome.includes(termo) ||
        medicoNome.includes(termo) ||
        (prontuario.descricao || '').toLowerCase().includes(termo) ||
        (prontuario.diagnostico || '').toLowerCase().includes(termo) ||
        (prontuario.prescricao || '').toLowerCase().includes(termo)
      )
    })
  }, [busca, prontuarios, pacientes, medicos])

  const abrirModalCadastro = () => {
    setModoEdicao(false)
    setFormData({
      id: null,
      pacienteId: '',
      medicoId: '',
      data: '',
      descricao: '',
      diagnostico: '',
      prescricao: '',
      observacoes: '',
    })
    setShowModal(true)
  }

  const abrirModalEdicao = (prontuario) => {
    setModoEdicao(true)
    setFormData({
      id: prontuario.id,
      pacienteId: String(prontuario.pacienteId || ''),
      medicoId: String(prontuario.medicoId || ''),
      data: prontuario.data ? prontuario.data.split('T')[0] : '',
      descricao: prontuario.descricao || '',
      diagnostico: prontuario.diagnostico || '',
      prescricao: prontuario.prescricao || '',
      observacoes: prontuario.observacoes || '',
    })
    setShowModal(true)
  }

  const fecharModal = () => {
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const salvarProntuario = async (e) => {
    e.preventDefault()

    if (!formData.pacienteId || !formData.medicoId || !formData.data || !formData.descricao) {
      alert('Preencha os campos obrigatórios.')
      return
    }

    const payload = {
      pacienteId: Number(formData.pacienteId),
      medicoId: Number(formData.medicoId),
      data: formData.data,
      descricao: formData.descricao,
      diagnostico: formData.diagnostico,
      prescricao: formData.prescricao,
      observacoes: formData.observacoes,
    }

    try {
      if (modoEdicao) {
        await api.put(`/prontuarios/${formData.id}`, payload)
        alert('Prontuário atualizado com sucesso!')
      } else {
        await api.post('/prontuarios', payload)
        alert('Prontuário cadastrado com sucesso!')
      }

      fecharModal()
      carregarDados()
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error)
      alert('Erro ao salvar prontuário.')
    }
  }

  const excluirProntuario = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este prontuário?')
    if (!confirmar) return

    try {
      await api.delete(`/prontuarios/${id}`)
      alert('Prontuário excluído com sucesso!')
      carregarDados()
    } catch (error) {
      console.error('Erro ao excluir prontuário:', error)
      alert('Erro ao excluir prontuário.')
    }
  }

  const totalProntuarios = prontuarios.length
  const prontuariosHoje = prontuarios.filter((item) => {
    if (!item.data) return false
    return item.data.split('T')[0] === new Date().toISOString().split('T')[0]
  }).length

  return (
    <div className="container-fluid py-4">
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <small className="text-muted">Total de prontuários</small>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <h3 className="fw-bold mb-0">{totalProntuarios}</h3>
                <FaNotesMedical size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <small className="text-muted">Registros de hoje</small>
              <h3 className="fw-bold mt-2 mb-0">{prontuariosHoje}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <small className="text-muted">Pacientes atendidos</small>
              <h3 className="fw-bold mt-2 mb-0">
                {new Set(prontuarios.map((item) => item.pacienteId)).size}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1">Gestão de Prontuários</h4>
              <p className="text-muted mb-0">
                Registre histórico clínico, diagnóstico e prescrição dos pacientes.
              </p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <div className="position-relative">
                <FaSearch
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '12px' }}
                />
                <Form.Control
                  type="text"
                  placeholder="Buscar prontuário..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="rounded-3 ps-5"
                />
              </div>

              <Button
                variant="primary"
                className="rounded-3 d-flex align-items-center gap-2"
                onClick={abrirModalCadastro}
              >
                <FaPlus />
                Novo Prontuário
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Diagnóstico</th>
                  <th>Prescrição</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Carregando prontuários...
                    </td>
                  </tr>
                ) : prontuariosFiltrados.length > 0 ? (
                  prontuariosFiltrados.map((prontuario) => (
                    <tr key={prontuario.id}>
                      <td>#{prontuario.id}</td>
                      <td className="fw-semibold">{getPacienteNome(prontuario.pacienteId)}</td>
                      <td>{getMedicoNome(prontuario.medicoId)}</td>
                      <td>{prontuario.data ? prontuario.data.split('T')[0] : ''}</td>
                      <td style={{ maxWidth: '220px' }}>
                        {prontuario.descricao || <span className="text-muted">Sem descrição</span>}
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        {prontuario.diagnostico || (
                          <span className="text-muted">Sem diagnóstico</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        {prontuario.prescricao || (
                          <span className="text-muted">Sem prescrição</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-3"
                            onClick={() => abrirModalEdicao(prontuario)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-3"
                            onClick={() => excluirProntuario(prontuario.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      Nenhum prontuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={fecharModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modoEdicao ? 'Editar Prontuário' : 'Cadastrar Prontuário'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={salvarProntuario}>
          <Modal.Body>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Paciente</Form.Label>
                <Form.Select
                  name="pacienteId"
                  value={formData.pacienteId}
                  onChange={handleChange}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label>Médico</Form.Label>
                <Form.Select
                  name="medicoId"
                  value={formData.medicoId}
                  onChange={handleChange}
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nome}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o atendimento realizado"
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Diagnóstico</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  placeholder="Informe o diagnóstico"
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Prescrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="prescricao"
                  value={formData.prescricao}
                  onChange={handleChange}
                  placeholder="Informe a prescrição"
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observações adicionais"
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {modoEdicao ? 'Salvar alterações' : 'Cadastrar prontuário'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ProntuariosPage