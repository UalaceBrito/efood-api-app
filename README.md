# efood — restaurantes e cardápios

Aplicação React, TypeScript e Vite inspirada no layout efood, com dados carregados dinamicamente da API EBAC.

## Funcionalidades

- Carregamento dos restaurantes e cardápios com `fetch` (AJAX), incluindo estados de carregamento, erro e nova tentativa.
- Página de detalhes do restaurante com pratos provenientes da API.
- Modal acessível ao clicar em **Comprar o produto**, com foto, descrição, porção e preço do prato.
- Adição demonstrativa ao carrinho gerenciado pelo Redux Toolkit.
- Layout responsivo usando Styled Components.

## Desenvolvimento e validação

```bash
npm install
npm run dev
npm run build
npm run lint
```

A API utilizada é `https://api-ebac.vercel.app/api/efood/restaurantes`. O carrinho é mantido em memória e a aplicação não processa pagamentos.
