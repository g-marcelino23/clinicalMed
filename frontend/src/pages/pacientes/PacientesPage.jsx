import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Table, Modal, Form, Row, Col, Spinner } from 'react-bootstrap'
import MainLayout from '../../components/layout/MainLayout'
import {
  listarPacientes,
  criarPaciente,
  atualizarPaciente,
  excluirPaciente as excluirPacienteApi,
} from '../../services/pacientesService'

function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [busca, setBusca] = useState('')

  const [formData, setFormData] = useState({
    id: null,
    usuario_id: '',
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    endereco: '',
    convenio: '',
    numero_convenio: '',
  })

  const carregarPacientes = async () => {
    try {
      setLoading(true)
      const dados = await listarPacientes()
      setPacientes(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
      alert('Erro ao carregar pacientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPacientes()
  }, [])

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase()

    return pacientes.filter((paciente) => {
      return (
        (paciente.nome || '').toLowerCase().includes(termo) ||
        (paciente.email || '').toLowerCase().includes(termo) ||
        (paciente.cpf || '').toLowerCase().includes(termo) ||
        (paciente.telefone || '').toLowerCase().includes(termo)
      )
    })
  }, [pacientes, busca])

  const abrirModalCadastro = () => {
    setModoEdicao(false)
    setFormData({
      id: null,
      usuario_id: '',
      nome: '',
      email: '',
      cpf: '',
      data_nascimento: '',
      telefone: '',
      endereco: '',
      convenio: '',
      numero_convenio: '',
    })
    setShowModal(true)
  }

  const abrirModalEdicao = (paciente) => {
    setModoEdicao(true)
    setFormData({
      id: paciente.id,
      usuario_id: paciente.usuario_id || '',
      nome: paciente.nome || '',
      email: paciente.email || '',
      cpf: paciente.cpf || '',
      data_nascimento: paciente.data_nascimento
        ? paciente.data_nascimento.split('T')[0]
        : '',
      telefone: paciente.telefone || '',
      endereco: paciente.endereco || '',
      convenio: paciente.convenio || '',
      numero_convenio: paciente.numero_convenio || '',
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

  const handleSalvarPaciente = async (e) => {
    e.preventDefault()

    try {
      if (modoEdicao) {
        await atualizarPaciente(formData.id, {
          cpf: formData.cpf,
          data_nascimento: formData.data_nascimento || null,
          telefone: formData.telefone,
          endereco: formData.endereco,
          convenio: formData.convenio,
          numero_convenio: formData.numero_convenio,
        })

        alert('Paciente atualizado com sucesso!')
      } else {
        if (!formData.usuario_id || !formData.cpf) {
          alert('usuario_id e cpf são obrigatórios.')
          return
        }

        await criarPaciente({
          usuario_id: Number(formData.usuario_id),
          cpf: formData.cpf,
          data_nascimento: formData.data_nascimento || null,
          telefone: formData.telefone,
          endereco: formData.endereco,
          convenio: formData.convenio,
          numero_convenio: formData.numero_convenio,
        })

        alert('Paciente cadastrado com sucesso!')
      }

      fecharModal()
      carregarPacientes()
    } catch (error) {
      console.error('Erro ao salvar paciente:', error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao salvar paciente.'

      alert(mensagem)
    }
  }

  const handleExcluirPaciente = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este paciente?')
    if (!confirmar) return

    try {
      await excluirPacienteApi(id)
      alert('Paciente excluído com sucesso!')
      carregarPacientes()
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao excluir paciente.'

      alert(mensagem)
    }
  }

  return (
    <MainLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">Gerencie os pacientes cadastrados no sistema.</p>
        </div>

        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Buscar paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ minWidth: '250px' }}
          />

          <Button variant="primary" className="rounded-4 px-4" onClick={abrirModalCadastro}>
            + Cadastrar Paciente
          </Button>
        </div>
      </div>

      <Card className="content-card p-3">
        <Card.Body>
          <h4 className="fw-bold mb-3">Lista de Pacientes</h4>

          <div className="table-responsive">
            <Table hover align="middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Convênio</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Carregando pacientes...
                    </td>
                  </tr>
                ) : pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>#{paciente.id}</td>
                      <td>{paciente.nome}</td>
                      <td>{paciente.cpf}</td>
                      <td>{paciente.telefone || '-'}</td>
                      <td>{paciente.email}</td>
                      <td>{paciente.convenio || '-'}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-3"
                            onClick={() => abrirModalEdicao(paciente)}
                          >
                            Editar
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-3"
                            onClick={() => handleExcluirPaciente(paciente.id)}
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
                      Nenhum paciente encontrado.
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
            {modoEdicao ? 'Editar Paciente' : 'Cadastrar Paciente'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSalvarPaciente}>
          <Modal.Body>
            <Row className="g-3">
              {!modoEdicao && (
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>ID do usuário PACIENTE</Form.Label>
                    <Form.Control
                      type="number"
                      name="usuario_id"
                      value={formData.usuario_id}
                      onChange={handleChange}
                      placeholder="Informe o ID do usuário já cadastrado com perfil PACIENTE"
                      required
                    />
                    <Form.Text className="text-muted">
                      Primeiro cadastre o usuário em /register com perfil PACIENTE.
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
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="Digite o CPF"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
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

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Data de nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Convênio</Form.Label>
                  <Form.Control
                    type="text"
                    name="convenio"
                    value={formData.convenio}
                    onChange={handleChange}
                    placeholder="Digite o convênio"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Número do convênio</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero_convenio"
                    value={formData.numero_convenio}
                    onChange={handleChange}
                    placeholder="Digite o número do convênio"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Digite o endereço"
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

export default PacientesPage