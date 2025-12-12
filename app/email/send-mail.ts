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
