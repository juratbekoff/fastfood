export interface UserRegisterDto {
    name: string,
    email: string,
    password: string,
    verificationId: string
}

export interface UserLoginDto {
    email: string,
    password: string
}