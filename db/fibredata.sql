-- Production du resultat fibre final
TRUNCATE TABLE cuivre_fibre;

with data as (
    select distinct on (fi.fibre_id) 
    fi.fibre_id, 
    fi.fibre_imb, 
    fp.fibre_addr_num, 
    fp.fibre_addr_num_cp,
    fp.fibre_addr_voie_type,
    fp.fibre_addr_voie,
    fp.fibre_addr_bat,
    fp.fibre_insee,
    fp.fibre_commune,
    substr(fp.fibre_insee, 1, 2) as fibre_dept,
    fp.fibre_imb_cat,
    fp.fibre_imb_etat,
    fp.fibre_pm,
    fp.fibre_pm_etat,
    fp.fibre_l33,
    fp.fibre_imb_type,
    ST_MakePoint(fp.fibre_lng, fp.fibre_lat) as fibre_point,
    ST_Transform(ST_Point(fp.fibre_lng, fp.fibre_lat, 4326), 3857) as fibre_point_3857,
    fc.cuivre_fcr_on as fibre_cuivre_fcr_on,
    fc.cuivre_ft_on as fibre_cuivre_ft_on
    from cuivre_ftthfc fc
    join cuivre_ftthimb fi on fi.fibre_id=fc.fibre_id
    join cuivre_ftthipe fp on fp.fibre_imb=fi.fibre_imb
)
INSERT INTO cuivre_fibre (fibre_id, fibre_imb, fibre_addr_num, fibre_addr_num_cp, fibre_addr_voie_type, fibre_addr_voie, fibre_addr_bat, fibre_insee, fibre_commune, fibre_dept, fibre_imb_cat, fibre_imb_etat, fibre_pm, fibre_pm_etat, fibre_l33, fibre_imb_type, fibre_point, fibre_point_3857, fibre_cuivre_fcr_on, fibre_cuivre_ft_on)
SELECT d.*
FROM data d;

CREATE INDEX ON cuivre_fibre using btree(fibre_imb);
CREATE INDEX ON cuivre_fibre using gist(fibre_point);
CREATE INDEX ON cuivre_fibre using gist(fibre_point_3857);