import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

async function restoreDatabase() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL nicht gefunden in .env');
    process.exit(1);
  }

  // Finde neuestes Backup
  const backupsDir = path.join(process.cwd(), 'backups');

  if (!fs.existsSync(backupsDir)) {
    console.error('❌ Kein backups/ Ordner gefunden');
    console.error('💡 Erstelle zuerst ein Backup mit: npm run db:backup');
    process.exit(1);
  }

  const backupFiles = fs.readdirSync(backupsDir)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: path.join(backupsDir, f),
      time: fs.statSync(path.join(backupsDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (backupFiles.length === 0) {
    console.error('❌ Keine Backup-Dateien gefunden in backups/');
    console.error('💡 Erstelle zuerst ein Backup mit: npm run db:backup');
    process.exit(1);
  }

  const backupFile = backupFiles[0].path;

  // Parse PostgreSQL URL
  const url = new URL(dbUrl);
  const database = url.pathname.slice(1).split('?')[0];
  const username = url.username;

  console.log('\n📥 Stelle Datenbank wieder her über Docker...\n');
  console.log(`Database: ${database}`);
  console.log(`Backup-Datei: ${backupFile}\n`);

  console.log('⚠️  WARNUNG: Dies wird alle vorhandenen Daten überschreiben!');
  console.log('⏳ Starte in 3 Sekunden...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    // Finde PostgreSQL Docker Container
    console.log('🔍 Suche PostgreSQL Container...');
    const { stdout: containers } = await execAsync('docker ps --format "{{.Names}}"');
    const postgresContainer = containers.split('\n').find(name =>
      name.includes('postgres') || name.includes('db')
    );

    if (!postgresContainer) {
      throw new Error('Kein PostgreSQL Container gefunden. Ist Docker gestartet?');
    }

    console.log(`✓ Gefunden: ${postgresContainer.trim()}\n`);

    // Lösche und erstelle Datenbank neu
    console.log('🗑️  Lösche alte Daten...');
    await execAsync(`docker exec ${postgresContainer.trim()} psql -U ${username} -d postgres -c "DROP DATABASE IF EXISTS ${database};"`);
    await execAsync(`docker exec ${postgresContainer.trim()} psql -U ${username} -d postgres -c "CREATE DATABASE ${database};"`);

    // Importiere Backup
    console.log('📥 Importiere Backup...');
    console.log('   Dies kann einige Minuten dauern...');

    // Kopiere Backup in Container
    const tempFile = `/tmp/restore-${Date.now()}.sql`;
    await execAsync(`docker cp "${backupFile}" ${postgresContainer.trim()}:${tempFile}`);
    console.log('   ✓ Backup in Container kopiert');

    // Führe Backup aus
    console.log('   ⏳ Führe SQL-Befehle aus...');
    const { stdout, stderr } = await execAsync(
      `docker exec ${postgresContainer.trim()} psql -U ${username} -d ${database} -f ${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 } // 50MB Buffer
    );

    if (stderr && !stderr.includes('NOTICE')) {
      console.log('   ⚠️  Warnungen:', stderr);
    }
    console.log('   ✓ SQL-Befehle ausgeführt');

    // Lösche temporäre Datei
    await execAsync(`docker exec ${postgresContainer.trim()} rm ${tempFile}`);
    console.log('   ✓ Temporäre Dateien bereinigt');

    console.log('\n✅ Datenbank erfolgreich wiederhergestellt!');
    console.log(`📁 Von: ${backupFile}\n`);

  } catch (error: any) {
    console.error('❌ Fehler beim Wiederherstellen:', error.message);
    console.error('\n💡 Mögliche Ursachen:');
    console.error('1. Docker Desktop läuft nicht');
    console.error('2. PostgreSQL Container ist gestoppt');
    console.error('3. Backup-Datei ist beschädigt\n');
    console.error('Überprüfe mit: docker ps');
    process.exit(1);
  }
}

restoreDatabase();
