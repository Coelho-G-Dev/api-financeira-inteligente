const validarDados = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
    } catch (erro) {
        return res.status(400).json({
            status: 'erro_validacao',
            mensagem: 'Dados inválidos fornecidos',
            erros: erro.errors.map(err => ({
                campo: err.path.join('.'),
                problema: err.message
            }))
        });
    }
};

module.exports = validarDados;