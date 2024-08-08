
-- Adresses cuivre
UPDATE cuivre_adresses SET cuivre_dept=substr(cuivre_insee, 1, 2);
UPDATE cuivre_adresses SET fibre_absente=TRUE WHERE fibre_imb IS NULL;

-- Points cuivre et fibre
UPDATE cuivre_adresses a SET cuivre_point=ST_MakePoint(g.lng, g.lat) FROM cuivre_geocoded g WHERE g.cuivre_addrrank=a.cuivre_addrrank;

UPDATE cuivre_ftthipe SET fibre_point=ST_MakePoint(fibre_lng, fibre_lat);

-- Indexation
CREATE INDEX ON cuivre_adresses using btree(cuivre_dept);
CREATE INDEX ON cuivre_adresses using gist(cuivre_point);
CREATE INDEX ON cuivre_ftthipe using btree(fibre_imb);
CREATE INDEX ON cuivre_ftthipe using gist(fibre_point);

-- Construction des liaisons cuivre/fibre
TRUNCATE TABLE cuivre_fibrepaths;

INSERT INTO cuivre_fibrepaths
SELECT ca.cuivre_addrrank, fi.fibre_id, ca.fibre_imb, ST_MakeLine(ca.cuivre_point, fi.fibre_point) as path
FROM cuivre_adresses ca
JOIN cuivre_ftthipe fi
    ON fi.fibre_imb=ca.fibre_imb
