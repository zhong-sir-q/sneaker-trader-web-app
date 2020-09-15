import sendgridMail from '@sendgrid/mail';
import config from '.'

sendgridMail.setApiKey(config.sendgridApiKey);

export default sendgridMail
