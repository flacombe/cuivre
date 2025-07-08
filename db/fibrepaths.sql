-- Construction des liaisons cuivre/fibre
TRUNCATE TABLE cuivre_fibrepaths;

WITH data as (
    select distinct on (ca.cuivre_addrrank, fi.fibre_id) 
        ca.cuivre_addrrank as cuivre_addrrank,
        CASE WHEN ca.cuivre_catreco='Categorie 1' THEN 1 WHEN ca.cuivre_catreco='Categorie 2' THEN 2 END as cuivre_catreco,
        fi.fibre_id as fibre_id,
        ca.fibre_imb as fibre_imb,
        ST_MakeLine(ca.cuivre_point, fi.fibre_point) as path,
        ST_MakeLine(ca.cuivre_point_3857, fi.fibre_point_3857) as path_3857,
        CASE 
            WHEN ca.cuivre_point_scale='housenumber' AND ST_Distance(ca.cuivre_point::geography, fi.fibre_point::geography) > 100 THEN 'length'
            WHEN ca.cuivre_point_scale!='housenumber' AND ST_Distance(ca.cuivre_point::geography, fi.fibre_point::geography) > 20 THEN 'link_street'
        ELSE NULL END as error
    FROM cuivre_adresses ca
    JOIN cuivre_fibre fi
        ON fi.fibre_imb=ca.fibre_imb
    WHERE ca.cuivre_point is not null and fi.fibre_point is not null and ca.cuivre_catreco IN ('Categorie 1', 'Categorie 2') and ca.fibre_imb is not null)
INSERT INTO cuivre_fibrepaths (cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, error, path, path_3857)
SELECT d.cuivre_addrrank, d.cuivre_catreco, d.fibre_id, d.fibre_imb, d.error, d.path, d.path_3857
FROM data d;

CREATE INDEX ON cuivre_fibrepaths using gist(path);
CREATE INDEX ON cuivre_fibrepaths using gist(path_3857);