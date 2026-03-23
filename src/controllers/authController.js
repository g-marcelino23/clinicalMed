const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { nome, email, senha, perfil } = req.body;

        // criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, senha, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, perfil`,
            [nome, email, senhaHash, perfil]
        );

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            usuario: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha inválida' });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                perfil: usuario.perfil
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            mensagem: 'Login realizado com sucesso',
            token
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    register,
    login
};