export interface IUser {
    username:string,
    password:string
}

export interface IPassword {
    platform:string
    username:string
    password:string
}

export interface INote {
    title:string
    note:string
}

export interface IPasswordDraft extends Partial<IPassword> {}