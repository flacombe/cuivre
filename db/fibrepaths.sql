-- Construction des liaisons cuivre/fibre
TRUNCATE TABLE cuivre_fibrepaths;

WITH data as (
    select distinct on (ca.cuivre_addrrank, fi.fibre_id) 
    ca.cuivre_addrrank as cuivre_addrrank,
    CASE WHEN ca.cuivre_catreco='Categorie 1' THEN 1 WHEN ca.cuivre_catreco='Categorie 2' THEN 2 END as cuivre_catreco,
    fi.fibre_id as fibre_id,
    ca.fibre_imb as fibre_imb,
    ST_MakeLine(ca.cuivre_point, fi.fibre_point) as path
FROM cuivre_adresses ca
JOIN cuivre_ftthipe fi
    ON fi.fibre_imb=ca.fibre_imb WHERE ca.cuivre_point is not null and fi.fibre_point is not null)
INSERT INTO cuivre_fibrepaths (cuivre_addrrank, cuivre_catreco, fibre_id, fibre_imb, path)
SELECT d.cuivre_addrrank, d.cuivre_catreco, d.fibre_id, d.fibre_imb, d.path
FROM data d;