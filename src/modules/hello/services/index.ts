import { sendEmail } from '@/utils/sendEmail';

export const sendEmailService = async () => {
  try {
    return await sendEmail({
      subject: 'Confirmación de cita',
      templateName: 'emailTemplate.html',
      recipients: ['javierbaeztattoos@gmail.com'],
      data: {
        cliente: 'Juan Tattoo',
        fecha: new Date().toLocaleString(),
      },
    });
  } catch (err) {
    console.error('Error enviando correo SES:', JSON.stringify(err, null, 2));
    throw new Error('Error al enviar el correo');
  }
};
