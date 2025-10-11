🎨 Plataforma de Discussão - Frontend
Frontend da plataforma de discussão inspirada no Reddit, desenvolvida com React, TypeScript, TailwindCSS e Vite.

🛠 PRÉ-REQUISITOS
Node.js 18+ Download

npm ou yarn

Backend rodando (veja README do backend)

📦 INSTALAÇÃO E CONFIGURAÇÃO
1. Navegue para a pasta do frontend
bash
cd reddit-platform/frontend
2. Instale as dependências
bash
npm install
3. Configure as variáveis de ambiente (Opcional)
bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite se necessário
nano .env
Conteúdo do .env:

env
VITE_API_BASE_URL=http://localhost:5000/api
🚀 EXECUTANDO O PROJETO
Desenvolvimento
bash
# Modo desenvolvimento
npm run dev
O frontend estará disponível em: http://localhost:5173

Build para Produção
bash
# Build do projeto
npm run build

# Preview do build
npm run preview
🏗️ ESTRUTURA DO PROJETO
text
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── context/        # Contextos React (Auth, etc.)
│   ├── services/       # API services
│   ├── types/          # Definições TypeScript
│   └── hooks/          # Custom hooks
├── public/             # Arquivos estáticos
└── dist/               # Build de produção
🎯 FUNCIONALIDADES
📋 Páginas Principais
/ - Página inicial com lista de comunidades

/login - Página de login

/register - Página de registro

/s/:slug - Página da comunidade

/post/:id - Página do post com comentários

/profile - Perfil do usuário

/admin - Painel de administração

/create-subtopic - Criar nova comunidade

👤 Autenticação
Registro e login de usuários

Persistência de sessão

Proteção de rotas privadas

🏠 Comunidades
Listagem de todas as comunidades

Criação de novas comunidades (usuários logados)

Páginas individuais de comunidade

Posts dentro de cada comunidade

📝 Posts e Comentários
Criação de posts em comunidades

Sistema de comentários em thread

Edição e deleção (autor/admin)

Contagem de comentários

⚙️ Administração
Painel de admin exclusivo

Gerenciamento de comunidades

Estatísticas da plataforma

Deleção e edição de conteúdo

🛠 SCRIPTS DISPONÍVEIS
bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run type-check   # Verificação de tipos TypeScript
🎨 TECNOLOGIAS E BIBLIOTECAS
Core
React 18 - Biblioteca UI

TypeScript - Tipagem estática

Vite - Build tool e dev server

Roteamento e Estado
React Router v6 - Roteamento

React Query - Gerenciamento de estado server

Context API - Estado global (Auth)

Estilização
TailwindCSS - Framework CSS

Lucide React - Ícones

HTTP Client
Axios - Cliente HTTP

🔧 CONFIGURAÇÃO AVANÇADA
Proxy para API
O Vite está configurado para proxy de requests /api para o backend:

javascript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
Tema Escuro/Claro
Suporte nativo a tema escuro via TailwindCSS:

html
<html class="dark"> <!-- Tema escuro -->
<html> <!-- Tema claro -->
Variáveis de Ambiente
env
VITE_API_BASE_URL=http://localhost:5000/api
🐛 SOLUÇÃO DE PROBLEMAS
Erro de porta 3000
bash
# O Vite tentará automaticamente outras portas
# Ou especifique uma porta:
npm run dev -- --port 3001
Problemas de CORS
Verifique se o backend está rodando

Confirme a URL da API no proxy

Verifique as configurações de CORS no backend

Erros de TypeScript
bash
# Verifique os tipos
npm run type-check

# Ou execute com Vite
npx tsc --noEmit
Problemas de Build
bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
📱 RESPONSIVIDADE
O projeto é totalmente responsivo com breakpoints:

Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

🔐 CREDENCIAIS DE TESTE
Apés rodar a seed do backend, use:

Admin
Email: admin@discusshub.com

Senha: admin123

Usuários Regulares
Email: john@example.com

Senha: user123

🚀 IMPLANTAÇÃO
Build para Produção
bash
npm run build
Arquivos de Produção
Os arquivos finais estarão em /dist e podem ser servidos por qualquer servidor web estático.

Servidores Recomendados
Netlify

Vercel

GitHub Pages

Nginx

Apache

📞 SUPORTE
Se encontrar problemas:

Verifique se o backend está rodando

Confirme as configurações de proxy

Verifique o console do navegador para erros

Teste em modo de desenvolvimento para logs detalhados

✅ Frontend rodando em: http://localhost:5173