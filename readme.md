# 🚀 API Financeira Inteligente (AI-Powered)

> Ecossistema de backend robusto para gestão financeira, projetado para ir além do tradicional CRUD. Esta API integra **Inteligência Artificial Generativa** para atuar como uma auditora financeira, analisando padrões de consumo e retornando diagnósticos estruturados.

## 🧠 Diferenciais Técnicos

- **🤖 Auditoria com IA:** Integração nativa com o SDK do Google Gemini usando *Prompt Engineering* para gerar diagnósticos críticos em modo JSON.
- **✅ Validação Rigorosa:** Implementação do `Zod` como *middleware* para garantir que dados malformados sejam bloqueados antes de atingir o banco de dados.
- **⏰ Proatividade (Background Jobs):** Utilização de `node-cron` para varrer a base de dados e gerar relatórios financeiros automatizados em segundo plano.
- **🔒 Segurança:** Rotas protegidas por tokens JWT, tratamento global de erros e `express-rate-limit` contra ataques de força bruta.
- **🧪 Testes Automatizados:** Cobertura de regras de negócio essenciais utilizando `Jest`.

## 🛠️ Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Servidor** | Node.js, Express |
| **Banco de Dados** | PostgreSQL, `pg` (node-postgres) |
| **Inteligência Artificial** | `@google/generative-ai` (Gemini 3.7 Flash) |
| **Segurança & Validação** | JWT (jsonwebtoken), Zod, CORS, Express Rate Limit |
| **Testes** | Jest |
| **Documentação** | Swagger (`swagger-ui-express`, `swagger-jsdoc`) |
| **Gerenciador de Processos** | PM2 |

## ⚙️ Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Conta no Google AI Studio (para obter a API Key do Gemini)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/api-financeira-inteligente.git
cd api-financeira-inteligente
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto baseando-se no modelo abaixo:

```env
# Configurações do Banco de Dados PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=api_financeira
DB_PASSWORD=sua_senha_do_banco_aqui
DB_PORT=5432

# Chave secreta para geração dos tokens de autenticação
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Chave de API do Google AI Studio (Gemini)
GEMINI_API_KEY=sua_chave_da_api_do_google_aqui
```

> ⚠️ **Nota de Segurança:** O arquivo `.env` está protegido pelo `.gitignore` e não deve ser enviado ao repositório.

### 4. Execute a Aplicação

**Opção 1 - Node.js direto:**
```bash
node index.js
```

**Opção 2 - Usando PM2 (recomendado para produção):**
```bash
pm2 start index.js --name api-financeira
```

A API estará rodando em: **http://localhost:3000**

## 📚 Documentação da API

Com o servidor rodando, acesse a interface interativa do Swagger para testar todas as rotas e visualizar a estrutura dos endpoints:

🔗 **http://localhost:3000/api-docs**

## 🧪 Testes

Para rodar a suíte de testes automatizados e verificar a integridade das validações de dados:

```bash
npm test
```

Para executar os testes em modo watch (desenvolvimento):
```bash
npm run test:watch
```

## 📦 Scripts Disponíveis

- `npm start` - Inicia a aplicação em produção
- `npm run dev` - Inicia a aplicação em modo desenvolvimento com hot-reload
- `npm test` - Executa os testes automatizados
- `npm run test:watch` - Executa os testes em modo watch
- `npm run lint` - Executa o linter para verificar a qualidade do código

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commitar suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Fazer push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request


**Desenvolvido por** [Gabriel Coelho Sousa](https://github.com/Coelho-G-Dev)
