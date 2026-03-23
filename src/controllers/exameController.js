const pool = require('../config/db');

const criarExame = async (req, res) => {
    try {
        const {
            consulta_id,
            paciente_id,
            medico_id,
            nome_exame,
            descricao,
            status,
            data_exame,
            resultado,
            observacoes
        } = req.body;

        if (!consulta_id || !paciente_id || !medico_id || !nome_exame) {
            return res.status(400).json({
                erro: 'consulta_id, paciente_id, medico_id e nome_exame são obrigatórios'
            });
        }

        const consultaExiste = await pool.query(
            'SELECT * FROM consultas WHERE id = $1',
            [consulta_id]
        );

        if (consultaExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Consulta não encontrada' });
        }

        const result = await pool.query(
            `INSERT INTO exames
      (consulta_id, paciente_id, medico_id, nome_exame, descricao, status, data_exame, resultado, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
            [
                consulta_id,
                paciente_id,
                medico_id,
                nome_exame,
                descricao,
                status || 'SOLICITADO',
                data_exame,
                resultado,
                observacoes
            ]
        );

        res.status(201).json({
            mensagem: 'Exame criado com sucesso',
            exame: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const listarExames = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        e.id,
        e.consulta_id,
        e.paciente_id,
        up.nome AS paciente_nome,
        e.medico_id,
        um.nome AS medico_nome,
        e.nome_exame,
        e.descricao,
        e.status,
        e.data_exame,
        e.resultado,
        e.observacoes,
        e.created_at
      FROM exames e
      JOIN pacientes p ON p.id = e.paciente_id
      JOIN usuarios up ON up.id = p.usuario_id
      JOIN medicos m ON m.id = e.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      ORDER BY e.created_at DESC
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const buscarExamePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
      SELECT
        e.id,
        e.consulta_id,
        e.paciente_id,
        up.nome AS paciente_nome,
        e.medico_id,
        um.nome AS medico_nome,
        e.nome_exame,
        e.descricao,
        e.status,
        e.data_exame,
        e.resultado,
        e.observacoes,
        e.created_at
      FROM exames e
      JOIN pacientes p ON p.id = e.paciente_id
      JOIN usuarios up ON up.id = p.usuario_id
      JOIN medicos m ON m.id = e.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      WHERE e.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Exame não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const atualizarExame = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome_exame,
            descricao,
            status,
            data_exame,
            resultado,
            observacoes
        } = req.body;

        const exameExiste = await pool.query(
            'SELECT * FROM exames WHERE id = $1',
            [id]
        );

        if (exameExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Exame não encontrado' });
        }

        const result = await pool.query(
            `UPDATE exames
       SET nome_exame = $1,
           descricao = $2,
           status = $3,
           data_exame = $4,
           resultado = $5,
           observacoes = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
            [nome_exame, descricao, status, data_exame, resultado, observacoes, id]
        );

        res.json({
            mensagem: 'Exame atualizado com sucesso',
            exame: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    criarExame,
    listarExames,
    buscarExamePorId,
    atualizarExame
};