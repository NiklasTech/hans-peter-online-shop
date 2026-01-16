import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

async function backupDatabase() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL nicht gefunden in .env');
    process.exit(1);
  }

  // Parse PostgreSQL URL
  const url = new URL(dbUrl);
  const database = url.pathname.slice(1).split('?')[0];
  const username = url.username;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupFileName = `backup-${timestamp}.sql`;
  const backupFile = path.join(process.cwd(), 'backups', backupFileName);

  // Erstelle backups Ordner falls nicht vorhanden
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  console.log('\n📦 Erstelle Datenbank-Backup über Docker...\n');
  console.log(`Database: ${database}`);
  console.log(`Backup-Datei: ${backupFile}\n`);

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

    console.log(`✓ Gefunden: ${postgresContainer}\n`);
    console.log('💾 Erstelle Backup...');

    // Backup über Docker erstellen
    const command = `docker exec ${postgresContainer.trim()} pg_dump -U ${username} ${database}`;
    const { stdout } = await execAsync(command);

    // Speichere Backup in Datei
    fs.writeFileSync(backupFile, stdout);

    const stats = fs.statSync(backupFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✅ Backup erfolgreich erstellt!');
    console.log(`📁 Datei: ${backupFile}`);
    console.log(`📊 Größe: ${fileSizeInMB} MB\n`);

    console.log('💡 Um das Backup auf einem anderen PC zu importieren:');
    console.log(`   npm run db:restore\n`);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Fehler beim Erstellen des Backups:', errorMessage);
    console.error('\n💡 Mögliche Ursachen:');
    console.error('1. Docker Desktop läuft nicht');
    console.error('2. PostgreSQL Container ist gestoppt');
    console.error('3. Container hat einen anderen Namen\n');
    console.error('Überprüfe mit: docker ps');
    process.exit(1);
  }
}

backupDatabase();
