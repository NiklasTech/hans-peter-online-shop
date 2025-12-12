import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

function createOAuth2Client(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  refreshToken: string
): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function createEmailMessage(options: EmailOptions): string {
  const { to, subject, text, html } = options;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html || text || ''
  ];
  return messageParts.join('\n');
}

export async function GET(request: NextRequest) {
    try {
    const body: EmailOptions = await request.json();

    const oauth2Client = createOAuth2Client(
      process.env.GMAIL_CLIENT_ID!,
      process.env.GMAIL_CLIENT_SECRET!,
      process.env.GMAIL_REDIRECT_URI!,
      process.env.GMAIL_REFRESH_TOKEN!
    );

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const rawMessage = createEmailMessage(body);
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'E-Mail erfolgreich versendet!' 
    });
  } catch (error) {
    console.error('Fehler beim Versenden:', error);
    return NextResponse.json(
      { success: false, message: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailOptions = await request.json();

    const oauth2Client = createOAuth2Client(
      process.env.GMAIL_CLIENT_ID!,
      process.env.GMAIL_CLIENT_SECRET!,
      process.env.GMAIL_REDIRECT_URI!,
      process.env.GMAIL_REFRESH_TOKEN!
    );

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const rawMessage = createEmailMessage(body);
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'E-Mail erfolgreich versendet!' 
    });
  } catch (error) {
    console.error('Fehler beim Versenden:', error);
    return NextResponse.json(
      { success: false, message: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}