# Backend Vincere (Node + Express + MongoDB)

## Rodar local
```bash
npm install
cp .env.example .env 
npm run dev
```

API: http://localhost:${PORT}/api
- GET /api/services
- GET /api/projects
- GET /api/testimonials
- POST /api/leads  { nome, email, telefone?, mensagem }

## Seed
```bash
node src/seeds/seed.js
```

## Deploy (Render)
- Conecte o repo ao Render > New Web Service
- Root: /backend
- Build: npm install
- Start: node src/index.js
- Configure variáveis de ambiente (MONGODB_URI, etc.)
- Em `FRONTEND_ORIGIN`, inclua a URL do front (Vercel/Netlify) e `http://localhost:5173` para dev