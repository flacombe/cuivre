-- Calcul des ranks pour chaque adresse unique, en paliatif de l'absence l'ID BAN
DROP TABLE IF EXISTS cuivre_rank;
create temp table cuivre_rank as select 
    cuivre_id,
    dense_rank() over w as new_addrrank 
from cuivre_adresses
window w as (order by cuivre_num, cuivre_voie, cuivre_insee);

CREATE INDEX on cuivre_rank using btree(cuivre_id);
CREATE INDEX on cuivre_rank using btree(new_addrrank);

-- Propagation des ranks dans la table principale (operation lourde)
update cuivre_adresses ca
    set cuivre_addrrank = cr.new_addrrank
from cuivre_rank cr
where cr.cuivre_id = ca.cuivre_id and ca.cuivre_addrrank is null;

-- Finalisation
CREATE INDEX ON cuivre_adresses using btree(cuivre_addrrank);
DROP TABLE cuivre_rank;