require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pricesHandler = require('./api/prices');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
