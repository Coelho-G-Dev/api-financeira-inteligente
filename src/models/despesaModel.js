const pool = require('../config/db');

const despesaModel = {
    
    listarTodas: async () => {
        const resultado = await pool.query('SELECT * FROM despesas ORDER BY id ASC');
        return resultado.rows;
    },

    criar: async (descricao, valor, categoria) => {
        const query = 'INSERT INTO despesas (descricao, valor, categoria) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await pool.query(query, [descricao, valor, categoria]);
        return resultado.rows[0];
    },

    atualizar: async (id, descricao, valor, categoria) => {
        const query = 'UPDATE despesas SET descricao = $1, valor = $2, categoria = $3 WHERE id = $4 RETURNING *';
        const resultado = await pool.query(query, [descricao, valor, categoria, id]);
        return resultado.rows[0];
    },

    deletar: async (id) => {
        const query = 'DELETE FROM despesas WHERE id = $1 RETURNING *';
        const resultado = await pool.query(query, [id]);
        return resultado.rows[0];
    }
};

module.exports = despesaModel;