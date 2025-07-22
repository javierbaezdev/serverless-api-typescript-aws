import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import fs from 'fs';
import path from 'path';

export interface SendEmailOptions {
  subject: string;
  templateName: string;
  recipients: string[];
  data: Record<string, string>;
  source?: string;
}

/**
 * Envía un correo basado en una plantilla HTML con parámetros dinámicos
 */
export const sendEmail = async ({
  subject,
  templateName,
  recipients,
  data,
  source = 'javierbaez.dev@gmail.com',
}: SendEmailOptions): Promise<string> => {
  const html = loadTemplate(templateName, data);

  const sesClient = new SESClient({
    region: process.env.AMAZON_REGION || 'us-east-1',
  });

  const command = new SendEmailCommand({
    Source: source,
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
      },
    },
  });

  try {
    const response = await sesClient.send(command);
    console.log('SES response:', JSON.stringify(response, null, 2));
    return 'Correo enviado correctamente (SES v3)';
  } catch (err) {
    console.error('SES ERROR:', JSON.stringify(err, null, 2));
    throw new Error('Error al enviar el correo');
  }
};

/**
 * Carga y reemplaza variables en una plantilla HTML
 */
const loadTemplate = (
  templateFile: string,
  replacements: Record<string, string>
): string => {
  const templatePath = path.resolve(
    process.cwd(),
    'src',
    'templates',
    templateFile
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`No se encontró la plantilla: ${templatePath}`);
  }

  let content = fs.readFileSync(templatePath, 'utf-8');

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`\\\${${key}}`, 'g'), value);
  }

  return content;
};
