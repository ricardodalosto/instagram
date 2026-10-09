require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pricesHandler = require('./api/prices');

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.RENDER_EXTERNAL_URL,
  ...(process.env.SITE_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin));
  }
}));
app.use(express.json());

// Servir arquivos estáticos do site
app.use(express.static(path.join(__dirname)));

// Endpoint da API de Preços
app.all('/api/prices', pricesHandler);

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 RD Sport Store rodando em: http://localhost:${PORT}`);
  console.log(`📡 API de Preços Shopee ativa em: http://localhost:${PORT}/api/prices`);
  console.log(`===================================================`);
});
