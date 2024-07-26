# Process des données

Les données sources ne sont pas forcément adaptées au rendu cartographique et au croisement entre elles.  
Il est nécessaire de les préparer pour pouvoir les présenter dans l'application.

## Installation

### Prérequis

On fera usage d'une base de données Postgresql fonctionnelle munie de l'extension postgis et hstore.  
Les outils habituels `curl` et client Postgresql `psql` sur linux sont également nécessaires.

### Postgresql

Créer les extensions postgis et hstore sur la base de données concernée

```sql
CREATE EXTENSION postgis;
CREATE EXTENSION hstore;
```

Installer ensuite le schéma prévu

```bash
psql -f db/schema.sql
```

## Sources / chargements

Il s'agit de télécharger les fichiers aux différentes sources, de les préparer puis de les charger en base

### Communes et programme de fermeture

Le fichier de programmation des communes est disponible en ligne, sur [le site institutionnel](https://gallery.orange.com/reseaux/?v=11c9b041-420b-47f3-8a91-8a9adbe2a86a) du groupe Orange.

On prendra soin de supprimer les colonnes suivantes pour produire un fichier csv :
* nom_departement
* libelle_epci
* dispo_offre_alt
* nom_oi
* prevision_completude_des_zapms_premierpm
* prevision_completude_des_zapms_dernierpm
* presence_suffisante_des_ocs
* eligibilite_ftth
* nb_suffisants_acces_actifs
* dispo_offre_de_gros_activees_ftth_clients_entreprise
* dispo_offres_de_gros_passive_haute_qualite_ftth
* dispo_offres_de_gros_activees_haute_qualite_ftth
* multi_acces
* rtc
* criteres_additionnels_fermeture
* tx_log_eligibles_fca
* tx_occupation_cuivre
* int_occ_cuivre
* tx_occ_cuivre

Il faut également modifier le format de dates des colonnes qui en contiennent pour passer du format français (JJ/MM/AAAA) au format [RFC9333](https://www.rfc-editor.org/rfc/rfc3339) (AAAA-MM-JJ).

```bash
psql -c "COPY cuivre_communes(com_insee, com_subdiv, com_nom, com_dept, com_epci, com_ftth, com_lot, com_fc_annonce, com_ft_annonce, com_adaptsav_annonce, com_fc_report, com_fc_initiale, com_ft_initiale, com_fc_ferme, com_ft_ferme, com_adaptsav_ferme, com_ftth_taux, com_loc_ref, com_imb_ref, com_loc_total, com_loc_deployes, com_loc_construction, com_loc_nonrac, com_imb_nonrac, com_loc_construction_nonrac, com_loc_rad, com_loc_rad_tarifspe, com_loc_refustiers, com_loc_blocage, com_oi) from stdin with csv header;" < ./communes_cuivre.csv
```

### Adresses du cuivre

Le fichier des adresses du cuivre est également disponible sur [le site institutionnel](https://gallery.orange.com/reseaux/?v=11c9b041-420b-47f3-8a91-8a9adbe2a86a) du groupe Orange.

```bash
psql -c "COPY cuivre_adresses(cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_num, cuivre_hexavia, cuivre_voie_hexacle, cuivre_num_hexacle, cuivre_catreco, cuivre_fibre_distance, fibre_l33, fibre_imb, meta_traitement) FROM stdin DELIMITER ';' CSV HEADER;" < ./cuivre_fibre.csv
```

### Adresses fibre

Les adresses fibres sont extraites de la collecte des fichiers IPE par l'ARCEP, publiés et mis à jour tous les trimestres [sur data.gouv](https://www.data.gouv.fr/fr/datasets/le-marche-du-haut-et-tres-haut-debit-fixe-deploiements/).


```bash
psql -c "COPY cuivre_ftthipe(fibre_lng, fibre_lat, fibre_imb, fibre_num, fibre_num_cp, fibre_voie_type, fibre_voie, fibre_bat, fibre_insee, fibre_postal, fibre_commune, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_geom_mod, fibre_imb_type, fibre_date_completude, fibre_date_completude_manquante) from stdin DELIMITER ',' CSV HEADER;" < ./carte_fibre_immeubles_2024_1_20240613.csv
```

## Pré-process

Quelques champs calculés et index doivent être créé en plus des données chargées.
On execute le script prévu :

```bash
psql -f db/preprocess.sql
```

## Ranking des adresses cuivre

Le fichier des adresses cuivre comporte des doublons et il est nécessaire d'identifier de manière unique chaque adresse.
Le référentiel hexaclé utilisé pour identifier les adresses est incomplet et obsolète, ces colonnes peuvent être ignorées.

Il est alors nécessaire de réattribuer proprement un identifiant à chaque adresse en se basant sur les composantes numéro/voie/commune.  
On utilise pour cela le script `ranking.sql`.

```bash
psql -f db/ranking.sql
```

Attention : la propagation des rangs aux adresses cuivre est une opération manipule une grande quantité de données, il peut être nécessaire de la spécialiser à un ou quelques départements en fonction de vos capacités et besoins et de répéter l'opération autant de fois que nécessaire.

## Geocodage

Les adresses cuivre doivent être géocodées.  
Faute de mieux pour l'instant, on peut utiliser un service externe. L'export suivant peut être utile :

```bash
psql -c "COPY(select distinct (cuivre_addrrank) as cuivre_addrrank, cuivre_num, cuivre_voie, cuivre_commune, cuivre_insee from cuivre_adresses) TO STDOUT WITH CSV HEADER;" > /tmp/adr.csv
```

Géocodez chaque adresse avec l'outil de votre choix.

On réintègre les résultats dans la table `cuivre_geocoded` selon le même principe :

```bash
psql -c "COPY cuivre_geocoded (cuivre_addrrank, lat, lng) from stdin with csv header" < /tmp/adr_geocoded.csv
```

Les points géographiques sont enfin créés grâce à la requête :

```sql
update cuivre_adresses a
set cuivre_point=ST_MakePoint(g.lng, g.lat)
from cuivre_geocoded g
where g.cuivre_addrrank=a.cuivre_addrrank;
```

## Liens cuivre / fibre

Bien que les données cuivre référencent les adresses fibres, il faut constituer des géométries reliant les deux.

Cela se passe avec le script :

```bash
psql -f db/fibrepaths.sql
```

Après cette étape, l'ensemble des données sont prêtes au rendu cartographique.

## Imports / Exports

Il peut être utile de transformer les géométries vers le webmercator pour du rendu web, en ajoutant `St_Transform(geom,'EPSG:4326', 'EPSG:3857')` sur les géométries concernées dans les requêtes d'export ci-dessous.

### Adresses cuivre

Import:
```bash
psql -c "COPY cuivre_adresses(cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_num, cuivre_point, cuivre_catreco, cuivre_fibre_distance, fibre_imb, fibre_l33, fibre_absente) from stdin with csv header;" < /tmp/cuivre_adresses.csv
```

Export :
```bash
psql -c "COPY(select distinct on (cuivre_addrrank) cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_num, ST_AsText(cuivre_point) as cuivre_point, cuivre_catreco, cuivre_fibre_distance, fibre_imb, fibre_l33, fibre_absente from cuivre_adresses) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_adresses.csv
```

### IPE FTTH

Import :
```bash
psql -c "COPY cuivre_ftthipe (fibre_imb, fibre_point, fibre_num, fibre_voie_type, fibre_voie, fibre_bat, fibre_insee, fibre_commune, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_imb_type, fibre_date_completude, fibre_date_completude_manquante) from stdin WITH CSV HEADER;" < /tmp/cuivre_ftthipe.csv
```

Export :
```bash
psql -c "COPY(select distinct on (fibre_imb) fibre_imb, ST_AsText(fibre_point) as fibre_point, fibre_num, fibre_voie_type, fibre_voie, fibre_bat, fibre_insee, fibre_commune, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_imb_type, fibre_date_completude, fibre_date_completude_manquante from cuivre_ftthipe) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_ftthipe.csv
```

### Liens cuivre / fibre

Import :
```bash
psql -c "COPY cuivre_fibrepaths (cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, path) from stdin with csv header;" < /tmp/cuivre_fibrepaths.csv
```

Export :
```bash
psql -c "COPY(select cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, ST_AsText(path) as path from cuivre_fibrepaths) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_fibrepaths.csv
```