# Boutique de Peluches Brawl Stars

Bienvenue dans le projet de boutique en ligne de peluches Brawl Stars ! Ce projet contient une application frontend permettant de présenter et vendre des peluches inspirées des personnages du jeu Brawl Stars.

## Fonctionnalités principales

* Liste dynamique des peluches avec images
* Détails pour chaque peluche (nom, description, prix, stock, réduction, rareté, taille, couleur)
* Filtres par taille, couleur, rareté
* Système de tri (prix croissant/décroissant)
* Design responsive pour mobile et desktop
* Possibilité d’ajouter des améliorations (panier, favoris, etc.)

## Installation et démarrage du projet

1. **Cloner le dépôt**
   Ouvre ton terminal et exécute les commandes suivantes :

```
git clone https://github.com/ERssi13/projet_boutique
cd projet_boutique
```

2. **Installer les dépendances**
   Assure-toi d’avoir Node.js installé. Puis lance :

```
npm install
```

3. **Démarrer le serveur de développement**
   Une fois les dépendances installées, lance l’application en local avec :

```
npm run dev
```


Le site sera accessible depuis ton navigateur à l’adresse suivante :
[http://localhost:3000](http://localhost:3000)

## Structure des fichiers

* `backebd/public/images` : contient les images des peluches
* `backend/data/products.json` : contient les données produits au format JSON
* `/frontend/` : les différentes pages de l’application
* `/frontend/css/` : fichiers de style (CSS ou Tailwind)

## Technologies utilisées

* React.js
* JavaScript ES6+
* Tailwind CSS
* JSON pour les données
* Node.js + npm ou yarn
