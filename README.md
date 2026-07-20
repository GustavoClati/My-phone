# Site institucional — My Phonne

Site estático, responsivo e focado em conversões por WhatsApp, ligações e visitas à loja física.

## Visualizar localmente

Abra `index.html` diretamente no navegador ou, para simular uma hospedagem, execute na pasta do projeto:

```powershell
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Atualizações rápidas

- WhatsApp, telefone, Facebook, avaliações, rotas e Analytics: `config.js`.
- Produtos e promoções: `products.js`.
- Fotos locais: pasta `assets/`.
- Textos e seções: `index.html`.
- Cores, tipografia e aparência principal: variáveis no início de `styles-base.css`.
- Ajustes responsivos complementares: `styles.css`.

Para cadastrar um produto, duplique um objeto em `products.js` e altere `name`, `description`, `category`, `price`, `image` e `imagePosition`.

## Antes de publicar

1. Confirme o número oficial do WhatsApp em `config.js`.
2. Adicione o domínio definitivo como URL canônica e nas metatags Open Graph.
3. Preencha os IDs de Google Analytics e Meta Pixel, se usados. Eles só carregam após o consentimento de cookies.
4. Publique em uma hospedagem com HTTPS/SSL ativo.
5. Gere `sitemap.xml` com o domínio final e cadastre o site no Google Search Console.
6. Revise a Política de Privacidade com o responsável legal da empresa.

## Imagens

As imagens `hero-tech.webp` e `store-service.webp` foram geradas especificamente para este projeto e otimizadas em WebP.

# My-phone
