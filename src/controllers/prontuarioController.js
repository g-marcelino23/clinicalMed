const pool = require('../config/db');

const criarProntuario = async (req, res) => {
    try {
        const {
            consulta_id,
            paciente_id,
            medico_id,
            queixa_principal,
            anamnese,
            diagnostico,
            observacoes
        } = req.body;

        if (!consulta_id || !paciente_id || !medico_id) {
            return res.status(400).json({
                erro: 'consulta_id, paciente_id e medico_id são obrigatórios'
            });
        }

        const consultaExiste = await pool.query(
            'SELECT * FROM consultas WHERE id = $1',
            [consulta_id]
        );

        if (consultaExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Consulta não encontrada' });
        }

        const prontuarioExiste = await pool.query(
            'SELECT id FROM prontuarios WHERE consulta_id = $1',
            [consulta_id]
        );

        if (prontuarioExiste.rows.length > 0) {
            return res.status(400).json({
                erro: 'Já existe um prontuário para essa consulta'
            });
        }

        const result = await pool.query(
            `INSERT INTO prontuarios
      (consulta_id, paciente_id, medico_id, queixa_principal, anamnese, diagnostico, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
            [
                consulta_id,
                paciente_id,
                medico_id,
                queixa_principal,
                anamnese,
                diagnostico,
                observacoes
            ]
        );

        await pool.query(
            `UPDATE consultas
       SET status = 'REALIZADA',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
            [consulta_id]
        );

        res.status(201).json({
            mensagem: 'Prontuário criado com sucesso',
            prontuario: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const listarProntuarios = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        p.id,
        p.consulta_id,
        p.paciente_id,
        up.nome AS paciente_nome,
        p.medico_id,
        um.nome AS medico_nome,
        p.queixa_principal,
        p.anamnese,
        p.diagnostico,
        p.observacoes,
        p.created_at
      FROM prontuarios p
      JOIN pacientes pa ON pa.id = p.paciente_id
      JOIN usuarios up ON up.id = pa.usuario_id
      JOIN medicos m ON m.id = p.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      ORDER BY p.created_at DESC
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const buscarProntuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
      SELECT
        p.id,
        p.consulta_id,
        p.paciente_id,
        up.nome AS paciente_nome,
        p.medico_id,
        um.nome AS medico_nome,
        p.queixa_principal,
        p.anamnese,
        p.diagnostico,
        p.observacoes,
        p.created_at
      FROM prontuarios p
      JOIN pacientes pa ON pa.id = p.paciente_id
      JOIN usuarios up ON up.id = pa.usuario_id
      JOIN medicos m ON m.id = p.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      WHERE p.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Prontuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const atualizarProntuario = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            queixa_principal,
            anamnese,
            diagnostico,
            observacoes
        } = req.body;

        const prontuarioExiste = await pool.query(
            'SELECT * FROM prontuarios WHERE id = $1',
            [id]
        );

        if (prontuarioExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Prontuário não encontrado' });
        }

        const result = await pool.query(
            `UPDATE prontuarios
       SET queixa_principal = $1,
           anamnese = $2,
           diagnostico = $3,
           observacoes = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
            [queixa_principal, anamnese, diagnostico, observacoes, id]
        );

        res.json({
            mensagem: 'Prontuário atualizado com sucesso',
            prontuario: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    criarProntuario,
    listarProntuarios,
    buscarProntuarioPorId,
    atualizarProntuario
};