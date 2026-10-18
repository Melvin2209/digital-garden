# 🌱 Le jardin de Melvin

Mon digital garden : des notes qui poussent avec le temps.

- Notes en Markdown dans `notes/`, listées dans `notes/index.json` (titre, stade, date, tags).
- Liens entre notes : `[[slug]]` ou `[[slug|texte]]`. Les backlinks sont calculés tout seuls.
- Stades : `seedling` 🌱, `budding` 🌿, `evergreen` 🌳.

## Lancer en local

```
python3 -m http.server
```

Puis ouvrir http://localhost:8000.

## Mettre en ligne

GitHub : Settings → Pages → Deploy from branch → `main` / root. Ou importer le repo sur Vercel (aucune config).
