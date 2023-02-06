import { UserRegisterDto } from "../types";
import { v4 as uuid } from "uuid"
import mailSender from "../controller/auth/mailSender";
import { Role } from "@prisma/client";

export {
    UserRegisterDto,
    uuid,
    mailSender,
    Role
}
