import { MailService, VerifyService, AuthService } from "../service";
import { Request, Response, NextFunction } from "express"
import { VerifyDto } from "../dtos";
import jwt from 'jsonwebtoken'
import { jwtConfig, messagesConfig } from "../configs";

const mailService = new MailService()
const verifyService = new VerifyService()
const authService = new AuthService()

export {
    Request,
    Response,
    NextFunction,
    VerifyDto,
    jwt,
    jwtConfig,
    messagesConfig,
    mailService,
    verifyService,
    authService
}
