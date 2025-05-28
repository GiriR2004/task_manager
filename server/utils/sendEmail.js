const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'girikeerthi21@gmail.com', // ✅ Your Gmail ID
        pass: 'bnvyxxhmnpxnbzaa',         // ✅ Your App Password (no spaces!)
      }
    });

    await transporter.sendMail({
      from: '"Task Reminder" <girikeerthi21@gmail.com>',
      to,
      subject,
      text,
    });

    console.log('✅ Email sent successfully!');
  } catch (err) {
    console.error('❌ Email failed to send:', err);
  }
};

module.exports = sendEmail;
