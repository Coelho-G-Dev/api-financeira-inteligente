const { z } = require('zod');

const despesaSchema = z.object({
    descricao: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
    valor: z.number().positive("O valor deve ser maior que zero"),
    categoria: z.string().min(2, "A categoria é obrigatória")
});

const validarDespesa = (req, res, next) => {
    const validacao = despesaSchema.safeParse(req.body);
    
    if (!validacao.success) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: validacao.error.issues.map(issue => issue.message)
        });
    }
    
    next(); 
};

module.exports = validarDespesa;