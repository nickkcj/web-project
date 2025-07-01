# Projeto Web - Frontend

## Visão Geral

Este é o frontend de uma aplicação de avaliações de filmes, desenvolvida em React com TypeScript, utilizando TailwindCSS para estilização e integração com um backend via API REST. O sistema permite que usuários se cadastrem, avaliem filmes, comentem, curtam avaliações de outros usuários e sigam perfis, promovendo interação social em torno de críticas cinematográficas.

## Funcionalidades Principais

- **Autenticação e Cadastro:**
  - Login e registro de novos usuários.
  - Proteção de rotas para garantir acesso apenas a usuários autenticados.
- **Perfil do Usuário:**
  - Visualização e edição de informações do perfil.
  - Exibição do ano de entrada do usuário ("membro desde").
- **Feed de Avaliações:**
  - Exibe avaliações de filmes feitas por todos os usuários.
  - Permite curtir, comentar e seguir outros usuários diretamente do feed.
  - Contadores de curtidas e comentários em tempo real.
- **Avaliação de Filmes:**
  - Modal para avaliar filmes, com campos para nota (1 a 5 estrelas), comentário (até 300 caracteres) e visibilidade (pública/privada).
  - Edição de avaliações já feitas.
- **Comentários:**
  - Modal para adicionar comentários em avaliações, com limite de 1000 caracteres.
- **Descoberta de Filmes:**
  - Página de descoberta com grid de filmes populares.
  - Modal com detalhes e ações rápidas (favoritar, avaliar, etc.).
- **Responsividade:**
  - Layout adaptado para desktop e mobile.
- **Carrossel e Destaques:**
  - Carrossel de filmes em destaque na home.
- **Outros:**
  - Animações de carregamento para feedback visual.
  - Mensagens de erro e sucesso via Snackbar/Alert.

## Estrutura de Pastas

```
frontend/
├── public/                # Arquivos estáticos (index.html, favicon, etc.)
├── src/
│   ├── components/        # Componentes reutilizáveis (Feed, Movie, Home, UI, etc.)
│   ├── pages/             # Páginas principais (Home, Feed, Perfil, etc.)
│   ├── services/          # Serviços de integração com API e store
│   ├── utils/             # Funções utilitárias
│   ├── App.tsx            # Componente raiz
│   └── index.tsx          # Ponto de entrada da aplicação
├── tailwind.config.js     # Configuração do TailwindCSS
├── tsconfig.json          # Configuração do TypeScript
└── package.json           # Dependências e scripts
```

## Principais Dependências

- **React**: Biblioteca principal para construção da UI.
- **TypeScript**: Tipagem estática para maior robustez.
- **TailwindCSS**: Utilitário de CSS para estilização rápida e responsiva.
- **React Router**: Gerenciamento de rotas.
- **Axios**: Requisições HTTP para o backend.
- **Radix UI**: Componentes acessíveis e modais.
- **Material UI**: Snackbar/Alert para feedback ao usuário.

## Scripts Disponíveis

- `npm start` — Inicia o servidor de desenvolvimento.
- `npm run build` — Gera a build de produção.
- `npm test` — Executa os testes automatizados.

## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/nickkcj/web-project.git
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente, se necessário (ex: URL da API).
4. Inicie o projeto:
   ```bash
   npm start
   ```
5. Acesse em `http://localhost:3000`

## Boas Práticas e Organização

- Componentes organizados por domínio (Feed, Movie, Home, UI, etc.).
- Separação clara entre lógica de apresentação (componentes) e lógica de dados (services).
- Uso de hooks para controle de estado e efeitos colaterais.
- Responsividade garantida via Tailwind e media queries.
- Código comentado e com tipagem explícita.

## Responsividade

O layout foi testado e ajustado para funcionar bem em diferentes tamanhos de tela, garantindo boa experiência tanto em dispositivos móveis quanto em desktops.

## Integração com o Backend

- Todas as ações (login, cadastro, avaliações, comentários, etc.) são feitas via API REST.
- O frontend espera endpoints padronizados para autenticação, CRUD de usuários, filmes, avaliações e comentários.
