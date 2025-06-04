# Backend API

API desenvolvida com Node.js, Express e Prisma para fornecer suporte ao projeto Absolute Cinema.

## 📋 Pré-requisitos

- Node.js (versão recomendada: 18.20.2)
- npm (geralmente vem com Node.js)
- Banco de dados configurado (PostgreSQL)

## Configuração do Ambiente

1. **Configurações iniciais**:
   
   Tenha o respositório clonado e entre na pasta raiz do backend 

2. **Configure a versão do Node.js**:

   ```bash
   echo "nodejs 18.20.2" > .tool-versions
   ```

3. **Instale as dependências**:

   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente**:

    Crie um arquivo .env na raiz do projeto com base no .env.example e insira as chaves necessárias para executar o projeto:
    (Consulte os desenvolvedores para obter as chaves necessárias)

   ```.env
    DATABASE_URL="URL de conexão com o banco"
    TMDB_API_KEY="Chave da biblioteca da TMDB"
    PORT=3000 # opcional
   ```

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

- **Prisma**:
  ```bash
  npx prisma generate  # Gera o cliente do Prisma
  npx prisma migrate dev  # Cria e aplica migrações
  npx prisma studio  # Abre interface visual do banco
  ```

## 🌐 Documentação da API

[WIP]

## 📊 Banco de Dados

Este projeto utiliza Prisma ORM. Para configurar:

1. Atualize o schema em `prisma/schema.prisma`
2. Execute as migrações:
   ```bash
   npx prisma migrate dev --name init
   ```

## 🔗 Links Úteis

- [Documentação do Node.js](https://nodejs.org/en/docs/)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [The Movie Database API](https://developers.themoviedb.org/3)

