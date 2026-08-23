const { Pool } = require('pg');

const pool = new Pool({
    user: 'u0_a64',
    host: '127.0.0.1',
    database: 'meu_banco',
    password: '', 
    port: 5432,
});

module.exports = pool;