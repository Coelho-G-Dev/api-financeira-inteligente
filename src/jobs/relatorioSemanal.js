const cron = require('node-cron');
const pool = require('../config/db');


cron.schedule('* * * * *', async () => {
    try {
        console.log('\n⏳ [Cron Job] Iniciando geração do relatório automático...');

        const query = 'SELECT COUNT(id) as total_despesas, SUM(valor) as valor_total FROM despesas';
        const resultado = await pool.query(query);

        const totalDespesas = resultado.rows[0].total_despesas || 0;
        const valorTotal = parseFloat(resultado.rows[0].valor_total || 0).toFixed(2);

        console.log(`📊 --- RESUMO FINANCEIRO ---`);
        console.log(`   - Despesas Registradas: ${totalDespesas}`);
        console.log(`   - Valor Total Gasto: R$ ${valorTotal}`);
        console.log(`📧 (Simulação) Alerta disparado com sucesso para o usuário!`);
        console.log(`------------------------------------------\n`);

    } catch (erro) {
        console.error('❌ Erro ao executar o Cron Job de relatório:', erro);
    }
});

console.log('🤖 Robô de relatórios semanais ativado e aguardando...');