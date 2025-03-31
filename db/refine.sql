-- Extraction des natures de voies
update cuivre_adresses set 
    cuivre_voie_nature=split_part(cuivre_voie,' ',1),
    cuivre_voie_correct=regexp_replace(cuivre_voie, '^[^ ]+', CASE
        WHEN cuivre_voie_nature='ALL' THEN 'ALLEE'
        WHEN cuivre_voie_nature='AV' THEN 'AVENUE'
        WHEN cuivre_voie_nature='AVE' THEN 'AVENUE'
        WHEN cuivre_voie_nature='BD' THEN 'BOULEVARD'
        WHEN cuivre_voie_nature='BLV' THEN 'BOULEVARD',
        WHEN cuivre_voie_nature='BLVD' THEN 'BOULEVARD',
        WHEN cuivre_voie_nature='BRD' THEN 'BOULEVARD',
        WHEN cuivre_voie_nature='CHE' THEN 'CHEMIN'
        WHEN cuivre_voie_nature='CHEM' THEN 'CHEMIN'
        WHEN cuivre_voie_nature='CHEN' THEN 'CHEMINEMENT'
        WHEN cuivre_voie_nature='CL' THEN 'CLOS'
        WHEN cuivre_voie_nature='CRS' THEN 'COURS'
        WHEN cuivre_voie_nature='DOM' THEN 'DOMAINE'
        WHEN cuivre_voie_nature='ESC' THEN 'ESCALIER'
        WHEN cuivre_voie_nature='ESP' THEN 'ESPLANADE'
        WHEN cuivre_voie_nature='FBG' THEN 'FAUBOURG'
        WHEN cuivre_voie_nature='HAM' THEN 'HAMEAU'
        WHEN cuivre_voie_nature='IMP' THEN 'IMPASSE'
        WHEN cuivre_voie_nature='LOT' THEN 'LOTISSEMENT'
        WHEN cuivre_voie_nature='MON' THEN 'MONTEE'
        WHEN cuivre_voie_nature='MTE' THEN 'MONTEE'
        WHEN cuivre_voie_nature='PAS' THEN 'PASSAGE'
        WHEN cuivre_voie_nature='PASS' THEN 'PASSAGE'
        WHEN cuivre_voie_nature='PCE' THEN 'PLACE'
        WHEN cuivre_voie_nature='PL' THEN 'PLACE'
        WHEN cuivre_voie_nature='PLA' THEN 'PLACE'
        WHEN cuivre_voie_nature='PR' THEN 'PROMENADE'
        WHEN cuivre_voie_nature='PROM' THEN 'PROMENADE'
        WHEN cuivre_voie_nature='R' THEN 'RUE'
        WHEN cuivre_voie_nature='RDPT' THEN 'ROND-POINT'
        WHEN cuivre_voie_nature='RES' THEN 'RESIDENCE'
        WHEN cuivre_voie_nature='RESID' THEN 'RESIDENCE'
        WHEN cuivre_voie_nature='RTE' THEN 'ROUTE'
        WHEN cuivre_voie_nature='SQ' THEN 'SQUARE'
        WHEN cuivre_voie_nature='TRA' THEN 'TRAVERSE'
        WHEN cuivre_voie_nature='VEN' THEN 'VENELLE'
        END)
WHERE split_part(cuivre_voie,' ',1) IN ('ALL', 'AV', 'AVE', 'BD', 'BLD', 'BLVD', 'BRD', 'CHE', 'CHEM', 'CHEN', 'CL', 'CRS', 'DOM', 'ESC', 'ESP', 'FBG', 'HAM', 'IMP', 'LOT', 'MON', 'MTE', 'PAS', 'PASS', 'PCE', 'PL', 'PLA', 'PR', 'PROM', 'R', 'RDPT', 'RES', 'RESID', 'RTE', 'SQ', 'TRA', 'VEN');
