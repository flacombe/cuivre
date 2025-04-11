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
psql -c "TRUNCATE cuivre_communes; COPY cuivre_communes(com_insee, com_subdiv, com_nom, com_dept, com_epci, com_ftth, com_lot, com_fc_annonce, com_ft_annonce, com_adaptsav_annonce, com_fc_report, com_fc_initiale, com_ft_initiale, com_fc_ferme, com_ft_ferme, com_adaptsav_ferme, com_ftth_taux, com_loc_ref, com_imb_ref, com_loc_total, com_loc_deployes, com_loc_construction, com_loc_nonrac, com_imb_nonrac, com_loc_construction_nonrac, com_loc_rad, com_loc_rad_tarifspe, com_loc_refustiers, com_loc_blocage, com_oi) from stdin with csv header;" < ./communes_cuivre.csv
```

### Adresses du cuivre

Le fichier des adresses du cuivre est également disponible sur [le site institutionnel](https://gallery.orange.com/reseaux/?v=11c9b041-420b-47f3-8a91-8a9adbe2a86a) du groupe Orange.

```bash
psql -c "TRUNCATE cuivre_adresses; COPY cuivre_adresses(cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_num, cuivre_hexavia, cuivre_voie_hexacle, cuivre_num_hexacle, cuivre_catreco, cuivre_fibre_distance, fibre_l33, fibre_imb, meta_traitement) FROM stdin DELIMITER ';' CSV HEADER;" < ./cuivre_adresses.csv
```

### IPE fibre

L'IPE fibre correspond à la collecte des fichiers IPE par l'ARCEP, publiés et mis à jour tous les trimestres [sur data.gouv](https://www.data.gouv.fr/fr/datasets/le-marche-du-haut-et-tres-haut-debit-fixe-deploiements/).

```bash
psql -c "TRUNCATE cuivre_ftthipe; COPY cuivre_ftthipe(fibre_lng, fibre_lat, fibre_imb, fibre_addr_num, fibre_addr_num_cp, fibre_addr_voie_type, fibre_addr_voie, fibre_addr_bat, fibre_insee, fibre_addr_postal, fibre_commune, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_geom_mod, fibre_imb_type, fibre_date_completude, fibre_date_completude_manquante) from stdin DELIMITER ',' CSV HEADER;" < ./carte_fibre_immeubles_2024_1_20240613.csv
```

### La base immeuble fibre

La base immeuble fibre est constituée par l'ARCEP et mise à jour tous les trimestres [sur data.arcep.fr](https://data.arcep.fr/fixe/maconnexioninternet/base_imb/index.html).  
Elle permet de faire le lien entre l'identifiant immeuble de l'IPE et une clé interne unique nationalement (à remplacer par l'identifiant RNB)

```bash
psql -c "TRUNCATE cuivre_ftthimb; COPY cuivre_ftthimb(fibre_id, fibre_x, fibre_y, fibre_imb, fibre_insee, fibre_nbloc, fibre_source, fibre_imb_type, fibre_ban, fibre_imb_num, fibre_addr_num, fibre_addr_num_cp, fibre_addr_voie, fibre_addr_ld, fibre_addr_insee, fibre_commune, fibre_addr_fantoir, fibre_addr_source) from stdin DELIMITER ';' CSV HEADER;" < ./fibre_imb.csv
```

### Le suivi de la fermeture du cuivre

Les indicateurs de suivi de la fermeture du cuivre permettent de connaître la progression de la fermeture commerciale rapide, à l'adresse.
Le fichier est constitué par l'ARCEP et mis à jour tous les trimestres [sur data.arcep.fr](https://data.arcep.fr/fixe/maconnexioninternet/fermeture_cuivre/index.html).

```bash
psql -c "TRUNCATE cuivre_ftthfc; COPY cuivre_ftthfc(fibre_id, cuivre_lot, cuivre_ft_on, cuivre_fc_on, cuivre_fcr_on, fibre_raccordable, cuivre_ft_annee) from stdin DELIMITER ';' CSV HEADER;" < ./fibre_fc.csv
```

## Pré-process

Quelques champs calculés et index doivent être créé en plus des données chargées.
On execute le script prévu :

```bash
psql -f db/preprocess.sql
```

## Traitement des données fibre

Il est nécessaire de produire une table enrichie des données fibre, croisement de l'IPE avec les drapeaux de fermeture du cuivre

```bash
psql -f db/fibredata.sql
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

## Affinage des adresses cuivre

La qualité des adresses cuivre peut empêcher un geocodage efficace. Il convient alors de compléter les intitulés de nature de voie.  
On utilise pour cela le script `refine.sql`

```bash
psql -f db/refine.sql
```

L'ancien nom de voie n'est pas supprimé, le résultat est stocké dans la colonne `cuivre_voie_correct` auquel il faudra donner la priorité dans les exports sur `cuivre_voie`.

## Geocodage

Les adresses cuivre doivent être géocodées. 

### Extrapolation depuis la fibre

Nous pouvons utiliser les positions fibres pour les adresses cuivre directement (catégorie 1) liées à des immeubles fibre.

On utilise le script prévu pour faire ces liens :

```bash
psql -f db/extrapolate.sql
```

Le script ne remplacera pas des positions d'adresses précédemment connues, il ne complète que les adresses cuivre sans position connues.

### Géocodage geographique

Le reste des adresses non directement liées à la fibre doit être géocodée géographiquement.
Faute de mieux pour l'instant, on peut utiliser un service externe. L'export suivant peut être utile :

```bash
psql -c "COPY(select distinct (cuivre_addrrank) as cuivre_addrrank, cuivre_num, case when cuivre_voie_correct is not null then cuivre_voie_correct else cuivre_voie end as cuivre_voie, cuivre_commune, cuivre_insee from cuivre_adresses where cuivre_point is null order by cuivre_addrrank limit 200000) TO STDOUT WITH CSV HEADER;" > /tmp/adr.csv
```

Géocodez chaque adresse avec l'outil de votre choix.  
Le fichier résultat comporte 5 colonnes: le rank (voir ci-dessus), longitude, latitude, le score du géocodage et l'échelle

On réintègre les résultats dans la table `cuivre_geocoded` selon le même principe :

```bash
psql -c "TRUNCATE cuivre_geocoded; COPY cuivre_geocoded (cuivre_addrrank, lng, lat, score, scale) from stdin with csv header" < /tmp/adr_geocoded.csv
```

Les points géographiques sont enfin créés grâce à la requête :

```sql
update cuivre_adresses ca
set 
    cuivre_point=ST_setSRID(ST_MakePoint(cg.lng, cg.lat), 4326), 
    cuivre_point_3857=ST_Transform(ST_point(cg.lng, cg.lat, 4326), 3857),
    cuivre_point_score=cg.score,
    cuivre_point_scale=cg.scale
from cuivre_geocoded cg
where cg.cuivre_addrrank=ca.cuivre_addrrank;
```

## Mise à jour partielle

Orange est suceptible de publier des mises à jour partielles des adresses cuivre par lot. C'est le cas à partir du lot 4, en date du 31 mars 2025.

Des opérations spéciales doivent être accomplies pour tenir la liste nationale des adresses à jour :
* Création d'une table `cuivre_adresses_maj` conforme au schéma de `cuivre_adresses`.
* Charger le fichier de mise à jour selon la commande ci-dessus de chargement initial des adresses cuivre de la base nationale
* Ranking, enrichissement puis rapprochement des adresses des positions fibre selon les opérations décrites ci-dessus
* Géocodage si nécessaire des positions restantes.
* Suppression des adresses de la base nationale sur les communes concernées par la mise à jour
```sql
delete from cuivre_adresses where cuivre_insee IN (select distinct cuivre_insee from cuivre_adresses_maj);
```
* Transfert des adresses mises à jour dans la base nationale
```sql
insert into cuivre_adresses (cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_voie_correct, cuivre_voie_nature, cuivre_num, cuivre_hexavia, cuivre_voie_hexacle, cuivre_num_hexacle, cuivre_point, cuivre_point_3857, cuivre_point_score, cuivre_point_scale, cuivre_catreco, cuivre_fibre_distance, fibre_l33, fibre_imb, fibre_absente, meta_traitement) 
    select cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_voie_correct, cuivre_voie_nature, cuivre_num, cuivre_hexavia, cuivre_voie_hexacle, cuivre_num_hexacle, cuivre_point, cuivre_point_3857, cuivre_point_score, cuivre_point_scale, cuivre_catreco, cuivre_fibre_distance, fibre_l33, fibre_imb, fibre_absente, meta_traitement
    from cuivre_adresses_maj;
```

## Liens cuivre / fibre

Bien que les données cuivre référencent les adresses fibres, il faut constituer des géométries reliant les deux.

Cela se passe avec le script :

```bash
psql -f db/fibrepaths.sql
```

Après cette étape, l'ensemble des données sont prêtes au rendu cartographique (non décrit ici).

## Imports / Exports

Il peut être utile de transformer les géométries vers le webmercator pour du rendu web, en utilisant les champs de géométrie suffixés de `_3857` concernées dans les requêtes d'export ci-dessous.

### Adresses cuivre

Import:
```bash
psql -c "COPY cuivre_adresses(cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, cuivre_voie, cuivre_num, cuivre_point, cuivre_point_3857, cuivre_point_score, cuivre_point_scale, cuivre_catreco, cuivre_fibre_distance, fibre_imb, fibre_l33, fibre_absente) from stdin with csv header;" < /tmp/cuivre_adresses.csv
```

Export :
```bash
psql -c "COPY(select distinct on (cuivre_addrrank) cuivre_addrrank, cuivre_lot, cuivre_commune, cuivre_insee, cuivre_iris, cuivre_dept, cuivre_voie_code, case when cuivre_voie_correct is not null then cuivre_voie_correct else cuivre_voie end as cuivre_voie, cuivre_num, ST_AsText(cuivre_point) as cuivre_point, ST_AsText(cuivre_point_3857) as cuivre_point_3857, cuivre_point_score, cuivre_point_scale, cuivre_catreco, cuivre_fibre_distance, fibre_imb, fibre_l33, fibre_absente from cuivre_adresses) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_adresses.csv
```

Lors d'un import on prendra soin de reconstruire les indexes prévus dans le fichier `db/preprocess.sql`

### Immeubles FTTH

Import :
```bash
psql -c "COPY cuivre_fibre (fibre_id, fibre_imb, fibre_addr_num, fibre_addr_voie_type, fibre_addr_voie, fibre_addr_bat, fibre_insee, fibre_commune, fibre_dept, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_imb_type, fibre_point, fibre_point_3857, fibre_cuivre_ft_on, fibre_cuivre_fcr_on) from stdin WITH CSV HEADER;" < /tmp/cuivre_fibre.csv
```

Export :
```bash
psql -c "COPY(select fibre_id, fibre_imb, fibre_addr_num, fibre_addr_voie_type, fibre_addr_voie, fibre_addr_bat, fibre_insee, fibre_commune, fibre_dept, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_imb_type, ST_AsText(fibre_point) as fibre_point, ST_AsText(fibre_point_3857) as fibre_point_3857, fibre_cuivre_ft_on, fibre_cuivre_fcr_on from cuivre_fibre) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_fibre.csv
```

Lors d'un import on prendra soin de reconstruire les indexes prévus dans le fichier `db/fibredata.sql`

### Liens cuivre / fibre

Import :
```bash
psql -c "COPY cuivre_fibrepaths (cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, path, path_3857) from stdin with csv header;" < /tmp/cuivre_fibrepaths.csv
```

Export :
```bash
psql -c "COPY(select cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, ST_AsText(path) as path, ST_AsText(path_3857) as path_3857 from cuivre_fibrepaths) TO STDOUT WITH CSV HEADER;" > /tmp/cuivre_fibrepaths.csv
```