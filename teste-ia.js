require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testar() {
    try {
        console.log("🔑 Chave carregada:", process.env.GEMINI_API_KEY ? "SIM (Tamanho: " + process.env.GEMINI_API_KEY.length + ")" : "NÃO ENCONTRADA");
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("🧠 Enviando requisição para a IA...");
        const result = await model.generateContent("Diga 'Olá, mundo!' em 3 palavras.");
        console.log("✅ Resposta da IA:", result.response.text());
    } catch (erro) {
        console.error("❌ Erro:", erro.message);
    }
}

testar();