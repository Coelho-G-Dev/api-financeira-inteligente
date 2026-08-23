const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const CHAVE_SECRETA = 'minha_chave_secreta_super_segura';

const authController = {
    registrar: async (req, res) => {
        try {
            const { nome, email, senha } = req.body;

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
            const resultado = await pool.query(query, [nome, email, senhaHash]);

            res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', usuario: resultado.rows[0] });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao registrar usuário. O e-mail já pode estar em uso.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            const query = 'SELECT * FROM usuarios WHERE email = $1';
            const resultado = await pool.query(query, [email]);
            
            if (resultado.rows.length === 0) {
                return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
            }

            const usuario = resultado.rows[0];

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
            }

            const token = jwt.sign({ id: usuario.id }, CHAVE_SECRETA, { expiresIn: '1h' });

            res.json({ mensagem: 'Login realizado com sucesso!', token });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro interno ao realizar login' });
        }
    }
};

module.exports = authController;