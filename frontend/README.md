# UniGames · Front-end

React 19 + Vite 8 + React Router + Apollo Client 4. Interface responsiva azul-marinho, catálogo, comparação de ofertas, mídia física, perfil, avaliações e relatórios.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre em `http://localhost:5173`. A configuração padrão é demonstração local. Para GraphQL ou REST, leia o README na raiz do projeto e `docs/INTEGRACAO.md`.

- `npm.cmd run build`: gera `dist`.
- `npm.cmd run preview`: abre a versão compilada.
- `npm.cmd run lint`: verificação estática.
- `npm.cmd test`: testes da demonstração, sem banco externo.

As classes do domínio ficam em `src/models/entities.js`. As queries/mutations seguem o schema do backend atualizado desta entrega.
