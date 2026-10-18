J'ai mené plusieurs A/B tests de bout en bout sur boulanger.com. La boucle :

1. **Hypothèse** à partir des données de comportement (ContentSquare).
2. **Implémentation** de la variante en React.
3. **Tracking** des événements.
4. **Recette**, puis lancement 50/50 (ABTasty).
5. **Suivi** des résultats et décision.

Exemple : la refonte d'une pop-in d'offre de service sur les smartphones. On a fusionné deux pop-ins en une, le test a été positif, et la variante est passée à 100 %.

## Leçon

Un A/B test, ce n'est pas un ticket de dev : c'est une question posée aux utilisateurs. Si le tracking est faux, la réponse est fausse. D'où l'intérêt d'être aussi un peu [[product-leader]].
