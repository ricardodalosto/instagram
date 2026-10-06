# Preços da Shopee no catálogo

O site consulta a API Aberta de Afiliados da Shopee no servidor e mostra o preço
mínimo da oferta encontrada para cada nome de produto. A consulta é feita quando
o cartão se aproxima da tela e repetida a cada 15 minutos enquanto a página
estiver aberta. A API pode ter atraso, limites de chamadas ou indisponibilidade;
portanto, isso não garante atualização instantânea a cada mudança de preço na
Shopee.

## 1. Obtenha as credenciais

Tenha acesso aprovado à API Aberta de Afiliados da Shopee e obtenha o App ID e o
App Secret no portal oficial: <https://affiliate.shopee.com.br/open_api>.
Sem as credenciais e as permissões necessárias, os preços reais não podem ser
consultados.

## 2. Configure o servidor

Na pasta do projeto, crie `.env` a partir de `.env.example` e preencha:

```env
SHOPEE_APP_ID=seu_app_id
SHOPEE_SECRET=seu_app_secret
PORT=3000
```

Não publique `.env`, não coloque essas chaves no JavaScript do navegador e não
envie o App Secret em conversas ou repositórios. Em hospedagem, cadastre as duas
chaves como variáveis de ambiente privadas no painel do servidor.

## 3. Execute localmente

```bash
npm install
npm start
```

Abra <http://localhost:3000>. O site estático sozinho não consegue assinar as
requisições da Shopee com segurança; o servidor Node.js precisa estar ativo.

## 4. Publique

Publique o servidor Node.js e o site em uma hospedagem que execute `server.js`
(ou adapte a função `api/prices.js` ao formato de funções serverless suportado
pelo provedor). Configure `SHOPEE_APP_ID` e `SHOPEE_SECRET` como variáveis
privadas nessa hospedagem. O endpoint `/api/prices` deve ficar no mesmo domínio
do site, ou o frontend precisará ser configurado com a URL pública do endpoint.

## Observação sobre correspondência dos produtos

A API é consultada pelo nome exibido no cartão e pode retornar ofertas parecidas,
não necessariamente o mesmo anúncio do link afiliado. Confira os preços e os
nomes retornados antes de publicar. Para garantir correspondência exata, use a
identificação do produto suportada pela API e associe-a explicitamente a cada
cartão, se disponível para a sua conta.
