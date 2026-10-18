Sur un site e-commerce à fort trafic, un incident sur le panier ou le paiement coûte cher, vite. Ma méthode :

1. **Diagnostiquer** rapidement : reproduire, isoler, lire les logs.
2. **Quick fix** pour arrêter l'hémorragie.
3. **Clean fix** ensuite, à froid, avec des tests.

Exemple : un appel API côté panier surchargeait un service les jours de soldes. On l'a remplacé par une donnée déjà présente dans la réponse. Moins d'appels, même résultat.

Lié : [[revue-de-code]], [[alternance-boulanger]].
