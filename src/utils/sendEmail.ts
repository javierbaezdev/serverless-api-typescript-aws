import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

export interface SendEmailOptions {
  subject: string;
  templateName: string;
  recipients: string[];
  data: Record<string, string>;
  source?: string; // opcional
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

  const params: AWS.SES.SendEmailRequest = {
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
  };

  try {
    await ses.sendEmail(params).promise();
    return 'Correo enviado correctamente';
  } catch (err) {
    console.error('Error enviando correo:', err);
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
