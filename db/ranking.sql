-- Création d'une table dédiée
DROP TABLE IF EXISTS cuivre_rank;
create table cuivre_rank as select 
    cuivre_id,
    dense_rank() over w as new_addrrank 
from cuivre_adresses
window w as (order by cuivre_num, cuivre_voie, cuivre_insee);

-- Propagation des ranks dans la table principale (operation lourde à améliorer)
update cuivre_fibre m
    set cuivre_addrrank = new_addrrank
from cuivre_rank s
where m.cuivre_id = s.cuivre_id;

-- Indexation
CREATE INDEX ON cuivre_adresses using btree(cuivre_addrrank);