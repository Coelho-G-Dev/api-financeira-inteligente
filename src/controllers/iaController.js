const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const iaController = {
    analisarDespesas: async (req, res, next) => {
        try {
            const query = 'SELECT descricao, valor, categoria FROM despesas ORDER BY id DESC LIMIT 30';
            const resultado = await pool.query(query);
            const despesas = resultado.rows;

            if (despesas.length === 0) {
                return res.status(404).json({ erro: 'Não há despesas suficientes para análise.' });
            }

            const dadosFormatados = despesas.map(d => `- ${d.descricao} (${d.categoria}): R$ ${d.valor}`).join('\n');
            const total = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0).toFixed(2);

            const prompt = `
                Aja como um auditor financeiro sênior e rigoroso.
                Analise o extrato de despesas abaixo e faça um diagnóstico crítico do padrão de consumo.
                
                DADOS DO EXTRATO:
                Total Gasto: R$ ${total}
                Lista de Despesas:
                ${dadosFormatados}
                
                REGRAS DE SAÍDA:
                Forneça a resposta APENAS utilizando a estrutura JSON abaixo.
                {
                    "risco": "Baixo, Médio ou Alto",
                    "maior_ofensor": "Nome da despesa ou categoria de maior impacto",
                    "diagnostico_critico": "Seu texto analítico e direto sobre o comportamento financeiro",
                    "acoes_corretivas": [
                        "Primeira ação imediata",
                        "Segunda ação imediata"
                    ]
                }
            `;

            const model = genAI.getGenerativeModel({ 
                model: "gemini-3.7-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });
            
            const result = await model.generateContent(prompt);
            
            const analiseJSON = JSON.parse(result.response.text());

            res.json({
                status: "sucesso",
                mensagem: "Análise concluída com sucesso",
                dados_auditoria: analiseJSON
            });

        } catch (erro) {
            next(erro);
        }
    }
};

module.exports = iaController;