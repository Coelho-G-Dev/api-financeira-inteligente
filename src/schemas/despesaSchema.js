const { z } = require('zod');

const despesaSchema = z.object({
    descricao: z.string({ required_error: "A descrição é obrigatória" })
        .min(3, "A descrição deve ter pelo menos 3 letras"),
    
    valor: z.number({ required_error: "O valor é obrigatório", invalid_type_error: "O valor deve ser um número" })
        .positive("O valor da despesa deve ser maior que zero"),
    
    categoria: z.string({ required_error: "A categoria é obrigatória" })
        .min(2, "A categoria deve ter pelo menos 2 letras")
});

module.exports = { despesaSchema };