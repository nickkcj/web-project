# Backend API

API desenvolvida com Node.js, Express e Prisma para fornecer suporte ao projeto Absolute Cinema.

## 📋 Pré-requisitos

- Node.js (versão recomendada: 18.20.2)
- npm (geralmente vem com Node.js)
- Banco de dados configurado (PostgreSQL/Supabase)

## ⚙️ Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/nickkcj/web-project.git
   cd web-project/backend
   ```

2. **Configure a versão do Node.js:**
   ```bash
   echo "nodejs 18.20.2" > .tool-versions
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```env
   DATABASE_URL= # URL de conexão com o banco (ex: postgresql://usuario:senha@host:5432/banco)
   TMDB_API_KEY= # Chave da API do The Movie Database
   JWT_SECRET= # Segredo para geração dos tokens JWT
   PORT=5000 # Porta do servidor backend
   ```

   > **Importante:** Nunca suba o arquivo `.env` para repositórios públicos.

## 🛠️ Comandos Úteis

- **Desenvolvimento** (hot-reload):
  ```bash
  npm run dev
  ```

- **Build** (para produção):
  ```bash
  npm run build
  ```

- **Iniciar produção**:
  ```bash
  npm start
  ```

- **Prisma:**
  ```bash
  npx prisma generate  # Gera o cliente do Prisma
  npx prisma migrate dev  # Cria e aplica migrações
  npx prisma studio  # Abre interface visual do banco
  ```

## 📊 Banco de Dados

Este projeto utiliza Prisma ORM e Supabase/Postgres. Para configurar:

1. Atualize o schema em `prisma/schema.prisma`
2. Execute as migrações:
   ```bash
   npx prisma migrate dev --name init
   ```

## 📁 Estrutura de Pastas

```
src/
  controllers/
  dtos/
  middleware/
  routes/
  services/
  config/
  scripts/
prisma/
  schema.prisma
.env
README.md
```

## 📝 Observações
- O backend exige autenticação JWT para acessar rotas protegidas.
- O projeto está preparado para integração com Google OAuth (opcional).
- O backend pode ser facilmente hospedado em serviços como Render, Railway, Vercel, etc.
- O front-end é responsivo e pode ser acessado em desktop e mobile.

## 🔗 Links Úteis

- [Documentação do Node.js](https://nodejs.org/en/docs/)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [The Movie Database API](https://developers.themoviedb.org/3)
- [Supabase](https://supabase.com/docs)

