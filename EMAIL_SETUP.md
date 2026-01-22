# E-Mail Konfiguration

## Überblick

Die Anwendung verwendet **Nodemailer** zum Versenden von E-Mails über SMTP. Bei der Registrierung erhalten neue Benutzer automatisch eine Willkommens-E-Mail.

## Einrichtung mit Gmail

### Schritt 1: App-Passwort erstellen

1. Gehe zu [Google Account Security](https://myaccount.google.com/security)
2. Aktiviere **2-Faktor-Authentifizierung** (falls noch nicht aktiviert)
3. Gehe zu **App-Passwörter**
4. Wähle **App**: Mail, **Gerät**: Anderes (Benutzerdefinierter Name)
5. Gib einen Namen ein: `Hans-Peter Shop`
6. Klicke auf **Generieren**
7. Kopiere das 16-stellige Passwort

### Schritt 2: .env Datei konfigurieren

Öffne die `.env` Datei und fülle folgende Werte aus:

```env
# E-Mail Konfiguration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # Das 16-stellige App-Passwort
SMTP_FROM=deine-email@gmail.com
SHOP_NAME=Hans-Peter Online Shop
SHOP_URL=http://localhost:3000
```

### Schritt 3: Anwendung neu starten

```bash
npm run dev
```

## Verwendung mit anderen E-Mail-Anbietern

### Outlook / Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine-email@outlook.com
SMTP_PASS=dein-passwort
```

### Custom SMTP Server

```env
SMTP_HOST=smtp.dein-server.de
SMTP_PORT=465  # oder 587
SMTP_SECURE=true  # true für Port 465, false für 587
SMTP_USER=dein-username
SMTP_PASS=dein-passwort
```

## Testen

Registriere einen neuen Benutzer in der Anwendung. Du solltest eine Willkommens-E-Mail erhalten.

Bei Fehlern werden diese in der Konsole ausgegeben:
```bash
Fehler beim Versenden der E-Mail: ...
```

## Troubleshooting

### "Invalid login" Fehler
- Überprüfe, ob die 2-Faktor-Authentifizierung aktiviert ist
- Erstelle ein neues App-Passwort
- Verwende das App-Passwort ohne Leerzeichen in der .env Datei

### "Connection timeout" Fehler
- Überprüfe SMTP_HOST und SMTP_PORT
- Stelle sicher, dass deine Firewall SMTP-Verbindungen erlaubt

### E-Mails kommen nicht an
- Überprüfe den Spam-Ordner
- Stelle sicher, dass SMTP_FROM eine gültige E-Mail-Adresse ist
- Bei Gmail: Stelle sicher, dass "Weniger sichere Apps" nicht blockiert sind

## Hinweise

- Die Registrierung schlägt **nicht** fehl, wenn die E-Mail nicht versendet werden kann
- E-Mail-Fehler werden nur geloggt, blockieren aber nicht die Registrierung
- In Produktion sollten die Credentials sicher gespeichert werden (z.B. über Umgebungsvariablen auf dem Server)
