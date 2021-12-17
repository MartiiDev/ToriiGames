
# Torii Games
Des jeux en ligne pour fans d'animes !

Pour jouer, c'est ici : [martiidev.github.io/toriigames](https://martiidev.github.io/toriigames/)  
Lien court : [bit.ly/toriigames](https://bit.ly/toriigames)
## Jeux
Je créé ces jeux de manière à ce qu'ils soient le plus personnalisable possible grâce à de nombreuses options.
- [x] Blind test des génériques (opening / ending)
- [ ] Pixel Guess (50%)
- [ ] Devine tête (0%)
- [ ] Pendu (0%)
## FAQ

#### Est-ce que c'est gratuit ?
Oui, tout est entièrement gratuit !  
Si vous voulez supporter mon travail, vous pouvez me faire un don sur [PayPal](https://paypal.me/edgarcaudron).

#### Ai-je besoin de m'inscrire pour jouer ?
Non.

#### Comment ça fonctionne ? (version simple)
Le jeu va chercher les données sur le site de Nautiljon (sur différentes pages selon les jeux).  
Ensuite, on fait ce qu'on veux avec ces données : les faire deviner, les afficher...

#### Comment ça fonctionne ? (version détaillée)

Le site s'appuie sur deux scripts PHP très simples :
- L'un est chargé de récupérer le code HTML de l'URL qu'on lui envoie (`file_get_contents(URL)`).
- Nautiljon empêche l'utilisation de ses images en dehors de son site. Le deuxième script permet de contourner cela en créant une copie base64 de l'image qu'on demande.

Tout le reste se passe en JavaScript. Les jeux font des requètes AJAX vers les scripts PHP pour récupérer les informations nécessaires (titres, vidéos, infos, images...) et les résultats sont manipulés en fonction des jeux.

#### Un jeu ne fonctionne plus
Deux raisons possibles :
- Nautiljon a fait des changements dans son interface
- Mon serveur est indisponible
Dans les deux cas, contactez-moi et j'essaierais de corriger ça au plus vite !

#### Is an English version planned?
Not in a near future. I'll need to find the time to change the whole website so that it accepts translations.  
Once it'll be done, anyone will be able to submit their translations.

## Support

Quelque chose ne fonctionne plus ? Vous avez une question ?  
Vous pouvez me contacter via le formulaire de contact du site ou via un des moyens ci-dessous.  
- Twitter : [@edgarcdrn](https://twitter.com/edgarcdrn)  
- Discord : Martii#4678  
- Site perso : [martiidev.github.io/website](https://martiidev.github.io/website/)  
