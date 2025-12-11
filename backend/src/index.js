require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', at: new Date().toISOString() }));
app.use('/api', routes);

app.use(require('./middlewares/error'));

const PORT = process.env.PORT || 3001;

db.connect()
  .then(() => app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`)))
  .catch((err) => { console.error('Erro ao conectar no MongoDB:', err); process.exit(1); });