require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 RD Sport Store rodando em: http://localhost:${PORT}`);
    console.log(`📡 API de Preços Shopee ativa em: http://localhost:${PORT}/api/prices`);
    console.log(`===================================================`);
  });
}

module.exports = app;
