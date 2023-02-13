export default {
    myMail: process.env.MyMail,
    myPassword: process.env.MyPassword,
    mailHost: process.env.mailHOST,
    mailPort: Number(process.env.MailPort),
    mailService: process.env.mailService,
    sendingMailSubject: process.env.mailSubject
}