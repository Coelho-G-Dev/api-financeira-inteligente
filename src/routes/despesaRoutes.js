const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');
const validarDespesa = require('../middlewares/validarDespesa');
const verificarToken = require('../middlewares/verificarToken');
const pool = require('../config/db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const iaController = require('../controllers/iaController');
const validarDados = require('../middlewares/validarDados');
const { despesaSchema } = require('../schemas/despesaSchema');

/**
 * @swagger
 * tags:
 *   name: Despesas
 *   description: Gerenciamento do controle financeiro
 */

/**
 * @swagger
 * /despesas:
 *   get:
 *     summary: Retorna a lista de despesas de forma paginada
 *     tags: [Despesas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de despesas obtida com sucesso
 *       401:
 *         description: Acesso negado (Token ausente ou inválido)
 */
router.get('/despesas', verificarToken, despesaController.listar);

/**
 * @swagger
 * /despesas:
 *   post:
 *     summary: Cria uma nova despesa
 *     tags: [Despesas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "Conta de Luz"
 *               valor:
 *                 type: number
 *                 example: 150.50
 *               categoria:
 *                 type: string
 *                 example: "Moradia"
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 *       400:
 *         description: Dados de entrada inválidos (Barrado pelo Zod)
 *       401:
 *         description: Acesso negado
 */
router.post('/despesas', verificarToken, validarDespesa, despesaController.criar);

/**
 * @swagger
 * /despesas/{id}:
 *   put:
 *     summary: Atualiza uma despesa existente
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da despesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               valor:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Despesa não encontrada
 */
router.put('/despesas/:id', verificarToken, validarDespesa, despesaController.atualizar);

/**
 * @swagger
 * /despesas/{id}:
 *   delete:
 *     summary: Deleta uma despesa do banco de dados
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da despesa
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 *       404:
 *         description: Despesa não encontrada
 */
router.delete('/despesas/:id', verificarToken, despesaController.deletar);

/**
 * @swagger
 * /despesas/upload:
 *   post:
 *     summary: Envia um extrato bancário em formato CSV
 *     tags: [Despesas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Extrato processado e dados salvos no banco
 */
// Note que passamos o 'upload.single' antes do Controller
router.post('/despesas/upload', verificarToken, upload.single('arquivo'), despesaController.importarExtrato);

/**
 * @swagger
 * /despesas/exportar:
 *   get:
 *     summary: Baixa um relatório completo de despesas em CSV
 *     tags: [Despesas]
 *     responses:
 *       200:
 *         description: Arquivo CSV baixado com sucesso
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Acesso negado
 */
router.get('/despesas/exportar', verificarToken, despesaController.exportarRelatorio);

/**
 * @swagger
 * /despesas/analise:
 *   get:
 *     summary: Gera um diagnóstico financeiro inteligente usando IA Generativa
 *     tags: [Inteligência Artificial]
 *     responses:
 *       200:
 *         description: Retorna a análise do Gemini baseada nas despesas
 *       401:
 *         description: Acesso negado
 */
router.get('/despesas/analise', verificarToken, iaController.analisarDespesas);

// A rota POST ficará assim:
router.post('/despesas', verificarToken, validarDados(despesaSchema), despesaController.criar);

// E a rota PUT ficará assim:
router.put('/despesas/:id', verificarToken, validarDados(despesaSchema), despesaController.atualizar);


module.exports = router;