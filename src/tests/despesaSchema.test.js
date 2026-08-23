const { despesaSchema } = require('../schemas/despesaSchema');

test('Deve bloquear uma despesa onde o valor é um texto (string)', () => {
    const despesaInvalida = {
        descricao: 'Conta de Luz',
        valor: 'cem reais',
        categoria: 'Moradia'
    };
    
    const resultado = despesaSchema.safeParse(despesaInvalida);
    
    expect(resultado.success).toBe(false);
});

test('Deve aprovar uma despesa com os dados perfeitamente corretos', () => {
    const despesaValida = {
        descricao: 'Conta de Luz',
        valor: 150.75, 
        categoria: 'Moradia'
    };
    
    const resultado = despesaSchema.safeParse(despesaValida);
    
    expect(resultado.success).toBe(true);
});