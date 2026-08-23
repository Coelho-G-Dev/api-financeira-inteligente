const jwt = require('jsonwebtoken');
const CHAVE_SECRETA = 'minha_chave_secreta_super_segura'; 

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decodificado = jwt.verify(token, CHAVE_SECRETA);
        req.usuarioId = decodificado.id; 
        next(); 
    } catch (erro) {
        res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;