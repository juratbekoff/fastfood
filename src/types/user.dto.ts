export interface UserRegisterDto {
    name: string | null,
    email: string,
    password: string,
    verificationId: string
}

export interface UserLoginDto {
    email: string,
    password: string
}