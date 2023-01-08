import dotenv from 'dotenv'

dotenv.config()

export { default as serverConfig } from "./server.config";
export { default as jwtConfig } from './jwt.config'
export { default as mailConfig } from './mail.config'
export { default as smsConfig } from './sms.config'
export { default as messagesConfig } from './messages.config'


