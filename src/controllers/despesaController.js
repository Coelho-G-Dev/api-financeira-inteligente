const pool = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser'); 

const despesaController = {
    listar: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const countResult = await pool.query('SELECT COUNT(*) FROM despesas');
            const totalItems = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalItems / limit);

            const query = 'SELECT * FROM despesas ORDER BY id DESC LIMIT $1 OFFSET $2';
            const resultado = await pool.query(query, [limit, offset]);

            res.json({
                dados: resultado.rows,
                paginacao: {
                    total_itens: totalItems,
                    total_paginas: totalPages,
                    pagina_atual: page,
                    itens_por_pagina: limit
                }
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro interno ao listar despesas' });
        }
    },

    criar: async (req, res) => {
        try {
            const { descricao, valor, categoria } = req.body;
            const query = 'INSERT INTO despesas (descricao, valor, categoria) VALUES ($1, $2, $3) RETURNING *';
            const resultado = await pool.query(query, [descricao, valor, categoria]);
            
            res.status(201).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao criar despesa' });
        }
    },

    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { descricao, valor, categoria } = req.body;
            
            const query = 'UPDATE despesas SET descricao = $1, valor = $2, categoria = $3 WHERE id = $4 RETURNING *';
            const resultado = await pool.query(query, [descricao, valor, categoria, id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({ erro: 'Despesa não encontrada' });
            }
            res.json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao atualizar despesa' });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            const query = 'DELETE FROM despesas WHERE id = $1 RETURNING *';
            const resultado = await pool.query(query, [id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({ erro: 'Despesa não encontrada' });
            }
            res.json({ mensagem: 'Despesa deletada com sucesso' });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao deletar despesa' });
        }
    },

    importarExtrato: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ erro: 'Nenhum arquivo CSV enviado.' });
            }

            const despesasImportadas = [];
            const caminhoArquivo = req.file.path;

            fs.createReadStream(caminhoArquivo)
                .pipe(csv())
                .on('data', (linha) => {
                    despesasImportadas.push(linha);
                })
                .on('end', async () => {
                    let inseridas = 0;
                    
                    for (let despesa of despesasImportadas) {
                        const descricao = despesa.Descricao || despesa.descricao;
                        const valor = parseFloat(despesa.Valor || despesa.valor);
                        const categoria = despesa.Categoria || despesa.categoria;

                        if (descricao && valor && categoria) {
                            const query = 'INSERT INTO despesas (descricao, valor, categoria) VALUES ($1, $2, $3)';
                            await pool.query(query, [descricao, valor, categoria]);
                            inseridas++;
                        }
                    }

                    fs.unlinkSync(caminhoArquivo);

                    res.status(201).json({ 
                        mensagem: 'Leitura do extrato concluída com sucesso!', 
                        linhas_processadas: despesasImportadas.length,
                        registros_salvos: inseridas 
                    });
                });

        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro interno ao processar o extrato' });
        }
    },


exportarRelatorio: async (req, res) => {
        try {
            const query = 'SELECT id, descricao, valor, categoria FROM despesas ORDER BY id DESC';
            const resultado = await pool.query(query);
            const despesas = resultado.rows;

            if (despesas.length === 0) {
                return res.status(404).json({ erro: 'Nenhuma despesa para exportar.' });
            }

            let csv = 'ID,Descricao,Valor,Categoria\n';

            despesas.forEach((d) => {
                csv += `${d.id},"${d.descricao}",${d.valor},"${d.categoria}"\n`;
            });

            res.header('Content-Type', 'text/csv; charset=utf-8');
            res.header('Content-Disposition', 'attachment; filename="relatorio_despesas.csv"');

            res.send(csv);

        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro interno ao exportar relatório' });
        }
    }
};

module.exports = despesaController;