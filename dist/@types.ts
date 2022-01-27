export interface User {
    username:string,
    password:string
}

export interface Password {
    platform:string
    username:string
    password:string
}

export interface Note {
    title:string
    note:string
}

export interface PasswordDraft extends Partial<Password> {}

