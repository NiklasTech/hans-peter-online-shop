'use server';

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string;
  bcc?: string;
}

/**
 * Erstellt einen Gmail OAuth2 Client
 */
export async function createOAuth2Client(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  refreshToken: string
): Promise<OAuth2Client> {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Erstellt eine E-Mail im RFC 2822 Format
 */
function createEmailMessage(options: EmailOptions): string {
  const { to, subject, text, html, cc, bcc } = options;

  const messageParts: string[] = [
    `To: ${to}`,
    `Subject: ${subject}`,
  ];

  if (cc) messageParts.push(`Cc: ${cc}`);
  if (bcc) messageParts.push(`Bcc: ${bcc}`);

  messageParts.push('MIME-Version: 1.0');
  messageParts.push('Content-Type: text/html; charset=utf-8');
  messageParts.push('');
  messageParts.push(html || text || '');

  return messageParts.join('\n');
}

/**
 * Versendet eine E-Mail über Gmail API
 */
export async function sendGmailEmail(
  auth: OAuth2Client,
  options: EmailOptions
): Promise<void> {
  try {
    const gmail = google.gmail({ version: 'v1', auth });

    const rawMessage = createEmailMessage(options);
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('E-Mail erfolgreich versendet!');
  } catch (error) {
    console.error('Fehler beim Versenden der E-Mail:', error);
    throw error;
  }
}

/**
 * Sendet eine Willkommens-E-Mail an einen neuen Benutzer
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
  try {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const redirectUri = process.env.GMAIL_REDIRECT_URI;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const senderEmail = process.env.SHOP_SENDER_EMAIL || 'noreply@hanspeter-shop.de';
    const shopName = process.env.SHOP_NAME || 'Hans-Peter Online Shop';

    if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
      console.error('Gmail OAuth Credentials nicht vollständig konfiguriert');
      return;
    }

    const auth = await createOAuth2Client(clientId, clientSecret, redirectUri, refreshToken);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Willkommen bei ${shopName}!</h1>
            </div>
            <div class="content">
              <p>Hallo ${userName},</p>
              <p>herzlich willkommen in unserem Online-Shop! Wir freuen uns sehr, dass du dich bei uns registriert hast.</p>
              <p>Mit deinem Account kannst du jetzt:</p>
              <ul>
                <li>✅ Produkte durchstöbern und kaufen</li>
                <li>✅ Deine Bestellungen verfolgen</li>
                <li>✅ Deine persönlichen Daten verwalten</li>
                <li>✅ Von exklusiven Angeboten profitieren</li>
              </ul>
              <p>Viel Spaß beim Einkaufen!</p>
              <a href="${process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000'}" class="button">Zum Shop</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${shopName}. Alle Rechte vorbehalten.</p>
              <p>Diese E-Mail wurde automatisch generiert. Bitte nicht antworten.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendGmailEmail(auth, {
      to: userEmail,
      subject: `Willkommen bei ${shopName}! 🎉`,
      html: htmlContent,
    });

    console.log(`Willkommens-E-Mail an ${userEmail} versendet`);
  } catch (error) {
    console.error('Fehler beim Versenden der Willkommens-E-Mail:', error);
    // Fehler nicht weiterwerfen, damit die Registrierung trotzdem funktioniert
  }
}
