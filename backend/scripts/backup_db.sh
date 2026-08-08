#!/bin/bash
# Script de Respaldo Automatizado
# Requiere PGPASSWORD y pg_dump en el sistema

DB_NAME="portal_comunal"
DB_USER="postgres"
BACKUP_DIR="./backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Iniciando respaldo de base de datos: $DB_NAME..."
docker exec -t comunal_db pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Respaldo completado exitosamente: $BACKUP_FILE"
else
    echo "Error al realizar el respaldo."
    rm $BACKUP_FILE
fi
