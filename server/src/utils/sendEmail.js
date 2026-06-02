const { Resend } = require('resend');

const sendEmail = async ({ to, subject, html }) => {
  // If the API key is not configured, throw a descriptive error to aid in debugging
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in the environment variables.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const fromName = process.env.FROM_NAME || 'CureBasket';
  // Resend free tier/unverified domains require sending from 'onboarding@resend.dev'
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Unknown error occurred while sending email via Resend');
  }

  return data;
};

module.exports = sendEmail;
