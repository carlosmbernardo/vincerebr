# Vincere – Projeto de Extensão (Parte III)

Stack: **Frontend** HTML+CSS+JS (estático) consumindo **Backend** Node/Express + MongoDB Atlas.

## Como rodar
1. Backend
```
cd backend
npm install
cp .env.example .env  # configure MONGODB_URI/DB e SMTP/OWNER_EMAIL
npm run dev
```
API: `http://localhost:3001/api`

2. Frontend
```
cd frontend
cp js/config.example.js js/config.js  # ajuste API_URL e WHATSAPP_LINK
npx serve . -l 5173   # ou Live Server
```
Front: `http://localhost:5173`

## Deploy
- **API** no Render (root: `/backend`), configure `FRONTEND_ORIGIN` com a URL do front.
- **Front** no Vercel/Netlify (root: `/frontend`). Suba `js/config.js` apontando para a API pública.

## Estrutura
- `backend/` API REST (services, projects, testimonials, leads)
- `frontend/` site estático com tema nas cores fornecidas