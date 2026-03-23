const pool = require('../config/db');

const criarConsulta = async (req, res) => {
    try {
        const {
            paciente_id,
            medico_id,
            agenda_id,
            data_consulta,
            hora_consulta,
            motivo,
            observacoes
        } = req.body;

        if (!paciente_id || !medico_id || !agenda_id || !data_consulta || !hora_consulta) {
            return res.status(400).json({
                erro: 'paciente_id, medico_id, agenda_id, data_consulta e hora_consulta são obrigatórios'
            });
        }

        const pacienteExiste = await pool.query(
            'SELECT * FROM pacientes WHERE id = $1',
            [paciente_id]
        );

        if (pacienteExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        const medicoExiste = await pool.query(
            'SELECT * FROM medicos WHERE id = $1',
            [medico_id]
        );

        if (medicoExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        const agendaExiste = await pool.query(
            'SELECT * FROM agendas_medicas WHERE id = $1',
            [agenda_id]
        );

        if (agendaExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Agenda não encontrada' });
        }

        const agenda = agendaExiste.rows[0];

        if (!agenda.disponivel) {
            return res.status(400).json({ erro: 'Essa agenda não está disponível' });
        }

        if (agenda.medico_id !== medico_id) {
            return res.status(400).json({
                erro: 'Essa agenda não pertence ao médico informado'
            });
        }

        const result = await pool.query(
            `INSERT INTO consultas
      (paciente_id, medico_id, agenda_id, data_consulta, hora_consulta, motivo, status, observacoes, checkin_realizado)
      VALUES ($1, $2, $3, $4, $5, $6, 'AGENDADA', $7, false)
      RETURNING *`,
            [paciente_id, medico_id, agenda_id, data_consulta, hora_consulta, motivo, observacoes]
        );

        await pool.query(
            'UPDATE agendas_medicas SET disponivel = false WHERE id = $1',
            [agenda_id]
        );

        res.status(201).json({
            mensagem: 'Consulta agendada com sucesso',
            consulta: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const listarConsultas = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        c.id,
        c.paciente_id,
        up.nome AS paciente_nome,
        c.medico_id,
        um.nome AS medico_nome,
        c.agenda_id,
        c.data_consulta,
        c.hora_consulta,
        c.motivo,
        c.status,
        c.observacoes,
        c.checkin_realizado,
        c.created_at
      FROM consultas c
      JOIN pacientes p ON p.id = c.paciente_id
      JOIN usuarios up ON up.id = p.usuario_id
      JOIN medicos m ON m.id = c.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      ORDER BY c.data_consulta, c.hora_consulta
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const buscarConsultaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
      SELECT
        c.id,
        c.paciente_id,
        up.nome AS paciente_nome,
        c.medico_id,
        um.nome AS medico_nome,
        c.agenda_id,
        c.data_consulta,
        c.hora_consulta,
        c.motivo,
        c.status,
        c.observacoes,
        c.checkin_realizado,
        c.created_at
      FROM consultas c
      JOIN pacientes p ON p.id = c.paciente_id
      JOIN usuarios up ON up.id = p.usuario_id
      JOIN medicos m ON m.id = c.medico_id
      JOIN usuarios um ON um.id = m.usuario_id
      WHERE c.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Consulta não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const atualizarStatusConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, observacoes, checkin_realizado } = req.body;

        const consultaExiste = await pool.query(
            'SELECT * FROM consultas WHERE id = $1',
            [id]
        );

        if (consultaExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Consulta não encontrada' });
        }

        const consulta = consultaExiste.rows[0];

        const result = await pool.query(
            `UPDATE consultas
       SET status = $1,
           observacoes = $2,
           checkin_realizado = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
            [status, observacoes, checkin_realizado, id]
        );

        if (status === 'CANCELADA') {
            await pool.query(
                'UPDATE agendas_medicas SET disponivel = true WHERE id = $1',
                [consulta.agenda_id]
            );
        }

        res.json({
            mensagem: 'Consulta atualizada com sucesso',
            consulta: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const deletarConsulta = async (req, res) => {
    try {
        const { id } = req.params;

        const consultaExiste = await pool.query(
            'SELECT * FROM consultas WHERE id = $1',
            [id]
        );

        if (consultaExiste.rows.length === 0) {
            return res.status(404).json({ erro: 'Consulta não encontrada' });
        }

        const consulta = consultaExiste.rows[0];

        await pool.query('DELETE FROM consultas WHERE id = $1', [id]);

        await pool.query(
            'UPDATE agendas_medicas SET disponivel = true WHERE id = $1',
            [consulta.agenda_id]
        );

        res.json({ mensagem: 'Consulta deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    criarConsulta,
    listarConsultas,
    buscarConsultaPorId,
    atualizarStatusConsulta,
    deletarConsulta
};