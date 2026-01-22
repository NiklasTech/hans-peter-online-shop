'use server';

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Erstellt einen Nodemailer Transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true für Port 465, false für andere Ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Versendet eine E-Mail über SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const transporter = createTransporter();

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    const shopName = process.env.SHOP_NAME || 'Hans-Peter Online Shop';

    await transporter.sendMail({
      from: `"${shopName}" <${senderEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`E-Mail erfolgreich an ${options.to} versendet`);
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
    const shopName = process.env.SHOP_NAME || 'Hans-Peter Online Shop';
    const shopUrl = process.env.SHOP_URL || 'http://localhost:3000';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; color: white;">🎉 Willkommen bei ${shopName}!</h1>
            </div>
            <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="margin: 0 0 15px 0;">Hallo ${userName},</p>
              <p style="margin: 0 0 15px 0;">herzlich willkommen in unserem Online-Shop! Wir freuen uns sehr, dass du dich bei uns registriert hast.</p>
              <p style="margin: 0 0 10px 0;">Mit deinem Account kannst du jetzt:</p>
              <ul style="margin: 0 0 15px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">✅ Produkte durchstöbern und kaufen</li>
                <li style="margin-bottom: 8px;">✅ Deine Bestellungen verfolgen</li>
                <li style="margin-bottom: 8px;">✅ Deine persönlichen Daten verwalten</li>
                <li style="margin-bottom: 8px;">✅ Von exklusiven Angeboten profitieren</li>
              </ul>
              <p style="margin: 15px 0;">Viel Spaß beim Einkaufen!</p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td style="background-color: #4F46E5; border-radius: 5px; text-align: center;">
                    <a href="${shopUrl}" style="display: inline-block; padding: 12px 30px; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 16px;">Zum Shop</a>
                  </td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${shopName}. Alle Rechte vorbehalten.</p>
              <p style="margin: 5px 0;">Diese E-Mail wurde automatisch generiert. Bitte nicht antworten.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Willkommen bei ${shopName}!

Hallo ${userName},

herzlich willkommen in unserem Online-Shop! Wir freuen uns sehr, dass du dich bei uns registriert hast.

Mit deinem Account kannst du jetzt:
- Produkte durchstöbern und kaufen
- Deine Bestellungen verfolgen
- Deine persönlichen Daten verwalten
- Von exklusiven Angeboten profitieren

Viel Spaß beim Einkaufen!

Besuche uns: ${shopUrl}

© ${new Date().getFullYear()} ${shopName}. Alle Rechte vorbehalten.
Diese E-Mail wurde automatisch generiert. Bitte nicht antworten.
    `;

    await sendEmail({
      to: userEmail,
      subject: `Willkommen bei ${shopName}! 🎉`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Willkommens-E-Mail an ${userEmail} versendet`);
  } catch (error) {
    console.error('Fehler beim Versenden der Willkommens-E-Mail:', error);
    // Fehler nicht weiterwerfen, damit die Registrierung trotzdem funktioniert
  }
}
