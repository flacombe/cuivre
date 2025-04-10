-- Selection des adresses extrapolables
CREATE TEMP TABLE cuivre_extrapolate as 
SELECT distinct (cuivre_addrrank) as cuivre_addrrank, 
    fibre_imb,
    null::geometry as cuivre_point
FROM cuivre_adresses
WHERE cuivre_adresses.cuivre_addrrank is not null
    AND cuivre_adresses.cuivre_catreco='Categorie 1'
    AND cuivre_adresses.cuivre_point is null;

CREATE INDEX on cuivre_extrapolate using btree(fibre_imb);

-- Mise à jour de chaque addrrank unique
update cuivre_extrapolate ce
set 
    cuivre_point=ST_SetSRID(ST_Translate(cf.fibre_point, 0.00015, 0), 4326)
from cuivre_fibre cf
where 
    cf.fibre_imb=ce.fibre_imb;

-- Renvoi dans la table principale des adresses
update cuivre_adresses ca
set 
    cuivre_point=ce.cuivre_point, 
    cuivre_point_3857=ST_Transform(ce.cuivre_point, 3857),
    cuivre_point_scale='ftth'
from cuivre_extrapolate ce
where ce.cuivre_addrrank=ca.cuivre_addrrank;

-- Suppression table temporaire
DROP TABLE cuivre_extrapolate;