import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Table, Modal, Form, Row, Col, Spinner } from 'react-bootstrap'
import MainLayout from '../../components/layout/MainLayout'
import {
  listarMedicos,
  criarMedico,
  atualizarMedico,
  excluirMedico as excluirMedicoApi,
} from '../../services/medicosService'

function MedicosPage() {
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [busca, setBusca] = useState('')

  const [formData, setFormData] = useState({
    id: null,
    usuario_id: '',
    nome: '',
    email: '',
    crm: '',
    especialidade: '',
    telefone: '',
  })

  const carregarMedicos = async () => {
    try {
      setLoading(true)
      const dados = await listarMedicos()
      setMedicos(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error('Erro ao carregar médicos:', error)
      alert('Erro ao carregar médicos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarMedicos()
  }, [])

  const medicosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase()

    return medicos.filter((medico) => {
      return (
        (medico.nome || '').toLowerCase().includes(termo) ||
        (medico.email || '').toLowerCase().includes(termo) ||
        (medico.crm || '').toLowerCase().includes(termo) ||
        (medico.especialidade || '').toLowerCase().includes(termo) ||
        (medico.telefone || '').toLowerCase().includes(termo)
      )
    })
  }, [medicos, busca])

  const abrirModalCadastro = () => {
    setModoEdicao(false)
    setFormData({
      id: null,
      usuario_id: '',
      nome: '',
      email: '',
      crm: '',
      especialidade: '',
      telefone: '',
    })
    setShowModal(true)
  }

  const abrirModalEdicao = (medico) => {
    setModoEdicao(true)
    setFormData({
      id: medico.id,
      usuario_id: medico.usuario_id || '',
      nome: medico.nome || '',
      email: medico.email || '',
      crm: medico.crm || '',
      especialidade: medico.especialidade || '',
      telefone: medico.telefone || '',
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

  const handleSalvarMedico = async (e) => {
    e.preventDefault()

    try {
      if (modoEdicao) {
        await atualizarMedico(formData.id, {
          crm: formData.crm,
          especialidade: formData.especialidade,
          telefone: formData.telefone,
        })

        alert('Médico atualizado com sucesso!')
      } else {
        if (!formData.usuario_id || !formData.crm || !formData.especialidade) {
          alert('usuario_id, crm e especialidade são obrigatórios.')
          return
        }

        await criarMedico({
          usuario_id: Number(formData.usuario_id),
          crm: formData.crm,
          especialidade: formData.especialidade,
          telefone: formData.telefone,
        })

        alert('Médico cadastrado com sucesso!')
      }

      fecharModal()
      carregarMedicos()
    } catch (error) {
      console.error('Erro ao salvar médico:', error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao salvar médico.'

      alert(mensagem)
    }
  }

  const handleExcluirMedico = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este médico?')
    if (!confirmar) return

    try {
      await excluirMedicoApi(id)
      alert('Médico excluído com sucesso!')
      carregarMedicos()
    } catch (error) {
      console.error('Erro ao excluir médico:', error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao excluir médico.'

      alert(mensagem)
    }
  }

  return (
    <MainLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="page-title">Médicos</h1>
          <p className="page-subtitle">Gerencie os médicos cadastrados no sistema.</p>
        </div>

        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Buscar médico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ minWidth: '250px' }}
          />

          <Button variant="primary" className="px-4" onClick={abrirModalCadastro}>
            + Cadastrar Médico
          </Button>
        </div>
      </div>

      <Card className="content-card p-3">
        <Card.Body>
          <h4 className="fw-bold mb-3">Lista de Médicos</h4>

          <div className="table-responsive">
            <Table hover align="middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CRM</th>
                  <th>Especialidade</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Carregando médicos...
                    </td>
                  </tr>
                ) : medicosFiltrados.length > 0 ? (
                  medicosFiltrados.map((medico) => (
                    <tr key={medico.id}>
                      <td>#{medico.id}</td>
                      <td>{medico.nome}</td>
                      <td>{medico.crm}</td>
                      <td>{medico.especialidade}</td>
                      <td>{medico.telefone || '-'}</td>
                      <td>{medico.email}</td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-3"
                            onClick={() => abrirModalEdicao(medico)}
                          >
                            Editar
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-3"
                            onClick={() => handleExcluirMedico(medico.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Nenhum médico encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={fecharModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modoEdicao ? 'Editar Médico' : 'Cadastrar Médico'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSalvarMedico}>
          <Modal.Body>
            <Row className="g-3">
              {!modoEdicao && (
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>ID do usuário MÉDICO</Form.Label>
                    <Form.Control
                      type="number"
                      name="usuario_id"
                      value={formData.usuario_id}
                      onChange={handleChange}
                      placeholder="Informe o ID do usuário já cadastrado com perfil MEDICO"
                      required
                    />
                    <Form.Text className="text-muted">
                      Primeiro cadastre o usuário em /register com perfil MEDICO.
                    </Form.Text>
                  </Form.Group>
                </Col>
              )}

              {modoEdicao && (
                <>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" value={formData.nome} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control type="email" value={formData.email} disabled />
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>CRM</Form.Label>
                  <Form.Control
                    type="text"
                    name="crm"
                    value={formData.crm}
                    onChange={handleChange}
                    placeholder="Digite o CRM"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Especialidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    placeholder="Digite a especialidade"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Digite o telefone"
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
              {modoEdicao ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default MedicosPage