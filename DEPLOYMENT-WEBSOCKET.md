# WebSocket Deployment Guide für nginx + HTTPS

Diese Anleitung zeigt, wie Sie die Hans-Peter Online Shop Anwendung mit Socket.IO hinter einem nginx Reverse Proxy mit HTTPS korrekt konfigurieren.

## Problem

Socket.IO WebSockets funktionieren nicht automatisch hinter einem nginx Reverse Proxy mit HTTPS, weil:

1. **WebSocket-Upgrade-Header** müssen korrekt weitergeleitet werden
2. **Proxy-Timeouts** sind standardmäßig zu kurz für lange WebSocket-Verbindungen
3. **HTTPS → WSS**: WebSocket-Verbindungen müssen über `wss://` (secure) laufen
4. Der **Socket.IO-Path** `/api/socketio` muss in nginx bekannt sein

## Lösung

### 1. nginx Konfiguration

Die Datei `nginx.conf` enthält eine vollständige nginx-Konfiguration. So verwenden Sie sie:

#### Option A: Direktes Kopieren (Ubuntu/Debian)

```bash
# Kopieren Sie die Konfiguration
sudo cp nginx.conf /etc/nginx/sites-available/hans-peter-shop

# Passen Sie die Konfiguration an:
sudo nano /etc/nginx/sites-available/hans-peter-shop

# Ändern Sie folgende Werte:
# - server_name: Ihre Domain (z.B. shop.example.com)
# - ssl_certificate: Pfad zu Ihrem SSL-Zertifikat
# - ssl_certificate_key: Pfad zu Ihrem SSL-Schlüssel
# - upstream server: Port Ihrer Next.js-Anwendung (Standard: 3000)

# Aktivieren Sie die Konfiguration
sudo ln -s /etc/nginx/sites-available/hans-peter-shop /etc/nginx/sites-enabled/

# Testen Sie die Konfiguration
sudo nginx -t

# Laden Sie nginx neu
sudo systemctl reload nginx
```

#### Option B: In bestehende Konfiguration einfügen

Falls Sie bereits eine nginx-Konfiguration haben, fügen Sie mindestens diesen Block hinzu:

```nginx
location /api/socketio {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;

    # KRITISCH für WebSocket
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # Standard Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Lange Timeouts für WebSocket
    proxy_connect_timeout 7d;
    proxy_send_timeout 7d;
    proxy_read_timeout 7d;

    # Buffering deaktivieren
    proxy_buffering off;
}
```

### 2. Umgebungsvariablen für Produktion

Kopieren Sie `.env.production.example` zu `.env.production` (oder `.env` auf dem Server):

```bash
cp .env.production.example .env.production
```

**WICHTIG**: Passen Sie folgende Werte an:

```env
# Ihre Domain mit HTTPS
NEXT_PUBLIC_APP_URL=https://ihre-domain.com
SHOP_URL=https://ihre-domain.com

# Datenbank
DATABASE_URL="postgresql://user:pass@host:5432/db"

# SMTP für E-Mails
SMTP_USER=ihre-email@gmail.com
SMTP_PASS=ihr-app-password

# JWT Secret (MUSS geändert werden!)
JWT_SECRET="ein-langer-zufälliger-string-min-32-zeichen"
```

### 3. Application Code (bereits korrekt)

Der vorhandene Code in `useSocket.ts` und `lib/socket.ts` ist bereits korrekt konfiguriert:

✅ **Client** ([hooks/useSocket.ts:13-20](hooks/useSocket.ts#L13-L20))
```typescript
socket = io({
  path: "/api/socketio",
  transports: ["websocket", "polling"], // Polling als Fallback
  reconnection: true,
});
```

✅ **Server** ([lib/socket.ts:18-29](lib/socket.ts#L18-L29))
```typescript
io = new SocketIOServer(server, {
  path: "/api/socketio",
  transports: ["websocket", "polling"],
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
  },
});
```

Da keine URL im Client angegeben ist, verbindet sich Socket.IO automatisch mit `window.location.origin`, was bei HTTPS automatisch `wss://` verwendet.

### 4. Deployment

```bash
# 1. Dependencies installieren
npm install

# 2. Datenbank migrieren
npm run db:migrate:deploy

# 3. Build erstellen
npm run build

# 4. Anwendung starten
npm start
```

### 5. SSL-Zertifikat (Let's Encrypt)

Falls Sie noch kein SSL-Zertifikat haben:

```bash
# Certbot installieren
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Zertifikat erstellen
sudo certbot --nginx -d ihre-domain.com -d www.ihre-domain.com

# Certbot konfiguriert nginx automatisch!
# Die Pfade werden automatisch eingetragen in:
# ssl_certificate /etc/letsencrypt/live/ihre-domain.com/fullchain.pem
# ssl_certificate_key /etc/letsencrypt/live/ihre-domain.com/privkey.pem
```

### 6. Testen

#### A. WebSocket-Verbindung testen

Öffnen Sie die Browser-Konsole (F12) und prüfen Sie:

```
🔌 Initializing Socket.io connection...
✅ Socket connected: <socket-id>
```

#### B. nginx Logs prüfen

```bash
# Zugriffslogs
sudo tail -f /var/log/nginx/nextjs_access.log

# Error Logs
sudo tail -f /var/log/nginx/nextjs_error.log
```

Sie sollten WebSocket-Upgrades sehen:
```
"GET /api/socketio/?EIO=4&transport=websocket HTTP/1.1" 101
```

Status Code `101` = "Switching Protocols" = WebSocket erfolgreich!

#### C. Chat-Funktionalität testen

1. Gehen Sie zu `/support` oder `/admin/support`
2. Senden Sie eine Nachricht
3. Prüfen Sie in der Browser-Konsole auf Fehler

### 7. Troubleshooting

#### Problem: WebSocket verbindet nicht

**Lösung 1**: nginx Konfiguration prüfen
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Lösung 2**: Firewall prüfen
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
```

**Lösung 3**: Browser-Konsole prüfen
- Öffnen Sie F12 → Network Tab
- Filtern Sie nach "socketio"
- Prüfen Sie den Status Code (sollte 101 sein)

#### Problem: CORS-Fehler

**Ursache**: `NEXT_PUBLIC_APP_URL` stimmt nicht mit der tatsächlichen Domain überein

**Lösung**: In `.env.production` korrigieren:
```env
NEXT_PUBLIC_APP_URL=https://ihre-tatsaechliche-domain.com
```

Anwendung neu starten:
```bash
pm2 restart hans-peter-shop
# oder
sudo systemctl restart hans-peter-shop
```

#### Problem: Verbindung bricht ab

**Ursache**: Timeouts zu kurz

**Lösung**: In nginx.conf prüfen:
```nginx
proxy_connect_timeout 7d;
proxy_send_timeout 7d;
proxy_read_timeout 7d;
```

#### Problem: Polling statt WebSocket

**Ursache**: Upgrade-Header fehlen in nginx

**Lösung**: In nginx.conf sicherstellen:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_http_version 1.1;
```

### 8. Monitoring

#### Application Logs

```bash
# PM2
pm2 logs hans-peter-shop

# SystemD
journalctl -u hans-peter-shop -f
```

Sie sollten sehen:
```
🔌 Initializing Socket.io connection...
Client connected: <socket-id>
Socket <id> joined chat-<chatId>
📨 Received send-message event: {...}
```

#### nginx Status

```bash
sudo systemctl status nginx
sudo nginx -t
```

### 9. Produktions-Checklist

- [ ] nginx Konfiguration angepasst (Domain, SSL-Pfade)
- [ ] SSL-Zertifikat installiert (Let's Encrypt)
- [ ] `.env.production` mit korrekten Werten
- [ ] `NEXT_PUBLIC_APP_URL` mit HTTPS
- [ ] `JWT_SECRET` geändert
- [ ] Datenbank migriert (`npm run db:migrate:deploy`)
- [ ] Build erstellt (`npm run build`)
- [ ] Firewall-Regeln gesetzt (Port 80, 443)
- [ ] nginx neu geladen (`sudo systemctl reload nginx`)
- [ ] Application gestartet (`npm start` oder PM2)
- [ ] WebSocket-Verbindung getestet (Browser-Konsole)
- [ ] Chat-Funktionalität getestet

## Zusammenfassung

Die wichtigsten Punkte für WebSocket mit nginx + HTTPS:

1. **WebSocket-Upgrade-Header** in nginx setzen
2. **Lange Timeouts** für WebSocket-Verbindungen
3. **HTTPS-Domain** in `NEXT_PUBLIC_APP_URL` setzen
4. **Socket.IO-Path** `/api/socketio` in nginx konfigurieren
5. **SSL-Zertifikat** korrekt einbinden

Mit dieser Konfiguration sollten WebSockets problemlos über nginx mit HTTPS funktionieren!

## Support

Bei Problemen:
1. Browser-Konsole prüfen (F12)
2. nginx Error Logs prüfen (`sudo tail -f /var/log/nginx/error.log`)
3. Application Logs prüfen
4. Network Tab im Browser prüfen (Status Code 101 = OK)
