export interface Password{
    platform:string
    username:string
    password:string
}
export interface PasswordDraft extends Partial<Password> {}