const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'shakum185@gamil.com',
  from: 'ks7053898905@gmail.com',
  subject: 'Sending with Twilio SendGrid ',
  text: 'and easy to do anywhere, even with Node.js',

};
sgMail.send(msg);

