# Conversion csv vers Parquet

Les outils OGR / gdal permettent une conversion vers le format Parquet en utilisant les fichiers vrt joints.  
Se reporter à la [documentation en ligne](https://gdal.org/en/stable/drivers/vector/parquet.html) du driver Parquet de GDAL.

Pour l'instant le driver ne permet que de créer une seule couche dans les fichiers geoparquet, ce pourquoi il n'est pas proposé d'assembler les trois couches dans le même fichier.

```sh
ogr2ogr -f Parquet /data/paths.pqt pathstopqt.vrt
```