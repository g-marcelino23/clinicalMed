const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const prontuarioRoutes = require('./routes/prontuarioRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

app.use('/auth', authRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/medicos', medicoRoutes);
app.use('/agendas', agendaRoutes);
app.use('/consultas', consultaRoutes);
app.use('/prontuarios', prontuarioRoutes);

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do sistema médico funcionando!' });
});

app.get('/protegida', authMiddleware, (req, res) => {
    res.json({
        mensagem: 'Rota protegida funcionando!',
        usuario: req.usuario
    });
});

app.get('/paciente', authMiddleware, roleMiddleware(['PACIENTE']), (req, res) => {
    res.json({ mensagem: 'Área do paciente' });
});

app.get('/medico', authMiddleware, roleMiddleware(['MEDICO']), (req, res) => {
    res.json({ mensagem: 'Área do médico' });
});

app.get('/secretario', authMiddleware, roleMiddleware(['SECRETARIO']), (req, res) => {
    res.json({ mensagem: 'Área do secretário' });
});

module.exports = app;