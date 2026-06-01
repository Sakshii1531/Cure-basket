const dns = require('dns');
const nodemailer = require('nodemailer');

// Render (and some PaaS hosts) have no IPv6 outbound route. Without this,
// Node may resolve Gmail to an IPv6 address and fail with ENETUNREACH.
// Forcing IPv4-first resolution makes SMTP connect over a reachable route.
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async ({ to, subject, html }) => {
  const port = Number(process.env.SMTP_PORT) || 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465, // implicit TLS on 465; STARTTLS otherwise
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Fail fast instead of hanging if the SMTP port is blocked/filtered
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'CureBasket'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
