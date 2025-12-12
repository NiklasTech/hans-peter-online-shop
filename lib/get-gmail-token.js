const { google } = require('googleapis');
const http = require('http');
const url = require('url');

// HIER DEINE WERTE EINFÜGEN:
const CLIENT_ID = '46914759046-mtsgao3qa35uumdmcu7ge6ghsnsgpovg.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3003';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('\n🔗 Öffne diese URL im Browser:\n');
console.log(authUrl);
console.log('\n⏳ Warte auf Autorisierung...\n');

const server = http.createServer(async (req, res) => {
  if (req.url.indexOf('/?code=') > -1) {
    const qs = new url.URL(req.url, REDIRECT_URI).searchParams;
    const code = qs.get('code');

    try {
      const { tokens } = await oauth2Client.getToken(code);
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
          <body style="font-family: system-ui; padding: 50px; text-align: center;">
            <h1 style="color: green;">✅ Erfolgreich!</h1>
            <p>Du kannst dieses Fenster schließen und zur Konsole zurückkehren.</p>
          </body>
        </html>
      `);

      console.log('✅ Erfolgreich! Kopiere diese Werte in deine .env.local:\n');
      console.log('GMAIL_CLIENT_ID=' + CLIENT_ID);
      console.log('GMAIL_CLIENT_SECRET=' + CLIENT_SECRET);
      console.log('GMAIL_REDIRECT_URI=' + REDIRECT_URI);
      console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('\n');
      
      server.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Fehler:', error.message);
      res.end('Fehler beim Abrufen des Tokens');
    }
  }
});

server.listen(3003, () => {
  console.log('🚀 Server läuft auf http://localhost:3003\n');
});