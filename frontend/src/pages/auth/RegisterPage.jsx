import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function RegisterPage() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [perfil, setPerfil] = useState('PACIENTE')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      await api.post('/auth/register', {
        nome,
        email,
        senha,
        perfil,
      })

      setSucesso('Usuário cadastrado com sucesso!')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      console.error(error)

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao cadastrar usuário'

      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 fw-bold">Cadastro</h2>

              {erro && <Alert variant="danger">{erro}</Alert>}
              {sucesso && <Alert variant="success">{sucesso}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Perfil</Form.Label>
                  <Form.Select
                    value={perfil}
                    onChange={(e) => setPerfil(e.target.value)}
                  >
                    <option value="PACIENTE">Paciente</option>
                    <option value="MEDICO">Médico</option>
                    <option value="SECRETARIO">Secretário</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Já tem conta?{' '}
                  <span
                    style={{ cursor: 'pointer', color: '#0d6efd' }}
                    onClick={() => navigate('/login')}
                  >
                    Entrar
                  </span>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPage