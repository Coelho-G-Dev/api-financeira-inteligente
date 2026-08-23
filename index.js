require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); 

const despesaRoutes = require('./src/routes/despesaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const swaggerDocs = require('./src/config/swagger');

const app = express();
const porta = 3000;

const limitador = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        status: "erro",
        mensagem: "Muitas requisições feitas por este IP. Por favor, tente novamente após 15 minutos."
    }
});

app.use(cors());
app.use(express.json());
app.use(limitador); 

swaggerDocs(app); 

require('./src/jobs/relatorioSemanal'); 

app.use('/auth', authRoutes);
app.use('/', despesaRoutes);

app.use((err, req, res, next) => {
    console.error('🔥 Erro Interno Capturado:', err.stack);
    res.status(500).json({
        status: 'erro',
        mensagem: 'Ocorreu uma falha interna no servidor.',
        detalhes: err.message 
    });
});

app.listen(porta, () => {
    console.log(`🚀 API rodando perfeitamente na porta ${porta}`);
});