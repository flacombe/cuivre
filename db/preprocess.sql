
-- Adresses cuivre
UPDATE cuivre_adresses SET cuivre_dept=substr(cuivre_insee, 1, 2);
UPDATE cuivre_adresses SET fibre_absente=TRUE WHERE fibre_imb IS NULL;

-- Indexation
CREATE INDEX ON cuivre_adresses using btree(cuivre_dept);
CREATE INDEX ON cuivre_adresses using gist(cuivre_point);
CREATE INDEX ON cuivre_adresses using gist(cuivre_point_3857);
CREATE INDEX ON cuivre_ftthipe using btree(fibre_imb);
CREATE INDEX ON cuivre_ftthimb using btree(fibre_imb);
CREATE INDEX ON cuivre_ftthfc using btree(fibre_imb);