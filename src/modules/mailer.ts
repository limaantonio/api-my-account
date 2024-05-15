import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: { user: '51e68a8cea7476', pass: '01f9d37977a43f' },
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      // @ts-ignore
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: 'auth/forgot_password.html/',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }),
);

export default transport;
