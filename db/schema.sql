-- Table cuivre_adresses
CREATE TABLE cuivre_adresses (
    cuivre_id serial primary key,
    cuivre_addrrank integer,
    cuivre_lot varchar,
    cuivre_commune varchar,
    cuivre_insee varchar, 
    cuivre_iris varchar,
    cuivre_dept varchar,
    cuivre_voie_code varchar,
    cuivre_voie varchar,
    cuivre_num varchar,
    cuivre_hexavia varchar,
    cuivre_voie_hexacle varchar,
    cuivre_num_hexacle varchar,
    cuivre_point geometry,
    cuivre_catreco varchar,
    cuivre_fibre_distance numeric,
    fibre_l33 varchar,
    fibre_imb varchar,
    fibre_absente boolean,
    meta_traitement date
);

-- Table cuivre_geocoded
CREATE TABLE cuivre_geocoded (
    cuivre_addrrank integer,
    lat numeric,
    lng numeric
);

-- Table cuivre_ftthipe
CREATE TABLE cuivre_ftthipe (
    fibre_id serial primary key,
    fibre_imb varchar,
    fibre_num varchar,
    fibre_num_cp varchar,
    fibre_voie_type varchar,
    fibre_voie varchar,
    fibre_bat varchar,
    fibre_insee varchar,
    fibre_postal varchar,
    fibre_commune varchar,
    fibre_dept varchar,
    fibre_imb_cat varchar,
    fibre_imb_etat varchar,
    fibre_pm varchar,
    fibre_pm_etat varchar,
    fibre_l33 varchar,
    fibre_geom_mod varchar,
    fibre_imb_type varchar,
    fibre_date_completude date,
    fibre_date_completude_manquante varchar,
    fibre_point geometry,
    fibre_lng numeric,
    fibre_lat numeric
);

-- Table cuivre_fibrepaths
CREATE TABLE cuivre_fibrepaths (
    path_id serial primary key,
    cuivre_addrrank integer,
    cuivre_catreco integer,
    fibre_id integer,
    fibre_imb varchar,
    path geometry
);

-- Table cuivre_communes
CREATE TABLE cuivre_communes (
    com_id serial primary key,
    com_insee varchar,
    com_nom varchar,
    com_subdiv boolean,
    com_dept varchar,
    com_epci varchar,
    com_ftth varchar,
    com_lot varchar,
    com_fc_annonce date,
    com_ft_annonce date,
    com_adaptsav_annonce date,
    com_fc_report boolean,
    com_fc_initiale date,
    com_ft_initiale date,
    com_fc_ferme date,
    com_ft_ferme date,
    com_adaptsav_ferme date,
    com_ftth_taux numeric,
    com_loc_ref integer,
    com_imb_ref integer,
    com_loc_total integer,
    com_loc_deployes integer,
    com_loc_construction integer,
    com_loc_nonrac integer,
    com_imb_nonrac integer,
    com_loc_construction_nonrac integer,
    com_loc_rad integer,
    com_loc_rad_tarifspe integer,
    com_loc_refustiers integer,
    com_loc_blocage integer,
    com_oi varchar,
    geometry geometry,
    tags hstore
);