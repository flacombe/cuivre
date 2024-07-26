# Cuivre
Il s'agit d'un socle logiciel pour visualiser les données à l'adresse, de transition des infrastructures téléphoniques en cuivre vers la fibre optique.

Il tire aventageusement parti de Node.js, Maplibre GL, Vite et Docker.

Les données géographiques visualisées peuvent être obtenues via un serveur de tuiles vectorielles conformes à la référence ci-dessous et par exemple déployé dans le cadre du [projet OpenInfraMap](https://github.com/flacombe/openinframap).

# Contexte

En France, le déploiement de la fibre optique à domicile est avancé et permet désormais l'abandon de l'infrastructure téléphonique historique sur paire de cuivre.  
Orange, l'opérateur en charge de son exploitatio a présenté un plan de fermeture devant s'échelonner sur 10 ans, jusqu'en 2030.

En attendant les différents jalons de fermeture, il est essentiel de disposer des données exposant les locaux concernés et les échéances en jeu.  
Se préparer est essentiel pour éviter de se trouver face à un mur lorsque l'infrastructure devra être arrêtée.

Ce logiciel vise donc à simplifier la présentation de ces informations pour tout un chacun.

# Installation

Il est possible d'installer le portail sur votre propre infrastructure.  
Utilisez les indications présentes dans le présent code et aux [mentions légales](https://cuivre.infos-reseaux.com/legal.html) en ligne.

## Docker

Le serveur est construit en utilisant docker à la racine du projet :

```sh
docker build -f Dockerfile.prod -t cuivre/web:latest .
```

## Proxy Nginx

La configuration nécessaire pour un reverse proxy Nginx est disponible dans le répertoire config.  
Vous aurez besoin d'éditer certains paramètres comme le nom de domaine ou les URL distantes.

```sh
ln -s config/cuivre-proxy.conf /etc/nginx/sites-enabled/cuivre.conf
```

## Configuration serveur

Quelques fichiers doivent être adaptés pour correspondre aux tuiles cartographiques utilisées.
* public/map.json : Adresse et contenu des tuiles utilisées pour décrire l'infrastructure
* src/style/style.json : Adresse des fichiers map.json à utiliser comme sources de données

# Mise en oeuvre

Pour lancer le serveur et accéder à l'interface, lancer simplement :

```sh
docker run -d --rm --name=gspweb -p 127.0.0.1:3100:80 cuivre/web:latest
```

Le serveur sera ainsi accessible sur le port 3100, pensez à l'intégrer à la configuration du proxy ci-dessus.
