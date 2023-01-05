export interface UserRegisterDto {
    name: string,
    email: string,
    password: string
}

export interface UserLoginDto {
    email: string,
    password: string
}