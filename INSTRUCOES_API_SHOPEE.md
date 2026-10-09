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
SITE_ORIGIN=http://localhost:3000
PORT=3000
```

Não publique `.env`, não coloque essas chaves no JavaScript do navegador e não
envie o App Secret em conversas ou repositórios. Em hospedagem, cadastre as duas
chaves como variáveis de ambiente privadas no painel do servidor.

## 3. Execute localmente

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

## 4. Como publicar na Vercel (Recomendado) ou no Render

### Opção A: Vercel (1 Clique - Gratuito e Ultrarrápido)
1. Envie o projeto para o seu GitHub.
2. Acesse <https://vercel.com> e conecte sua conta do GitHub.
3. Clique em **Add New > Project** e selecione o repositório.
4. Na seção **Environment Variables**, adicione:
   - `SHOPEE_APP_ID` = seu App ID da Shopee
   - `SHOPEE_SECRET` = seu App Secret da Shopee
5. Clique em **Deploy**. Pronto! Seu site estará no ar com domínio SSL grátis e preços em tempo real integrados.

### Opção B: Render
1. Conecte o repositório no <https://render.com>.
2. Crie um **Web Service** usando o comando de build `npm run build` e start `npm start`.
3. Adicione `SHOPEE_APP_ID` e `SHOPEE_SECRET` nas Environment Variables.

O plano gratuito pode suspender o serviço após inatividade, tornando o primeiro
acesso mais lento. A Shopee também pode impor limites ou atrasos nas consultas.
Confira nome e preço da oferta retornada: uma busca pelo nome pode encontrar
produtos parecidos, não necessariamente o mesmo anúncio do link afiliado.

Se o repositório ainda não foi enviado ao GitHub, uma forma visual de fazer isso
é instalar o GitHub Desktop, escolher **File > Add local repository**, selecionar
a pasta do projeto e usar **Publish repository**. Revise os arquivos antes de
publicar e confirme que `.env` não está entre eles.

## Observação sobre correspondência dos produtos

A API é consultada pelo nome exibido no cartão e pode retornar ofertas parecidas,
não necessariamente o mesmo anúncio do link afiliado. Confira os preços e os
nomes retornados antes de publicar. Para garantir correspondência exata, use a
identificação do produto suportada pela API e associe-a explicitamente a cada
cartão, se disponível para a sua conta.
