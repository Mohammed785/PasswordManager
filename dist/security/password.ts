import { Crypto } from "./crypto";
import { db } from "../main";
import { createPassword, findUser, getPassword, updatePassword } from "../db";
import { Model,LooseObject } from "trilogy";
import { sendError, sendNotification } from "../utils";


// still need a lot work and changes
export class Password {
    username: string;
    password: string;
    platform: string;
    hashed: boolean=false;
    masterKey : Buffer;
    model:Model<LooseObject>
    constructor(platform:string,username:string,password:string){
        this.username = username;
        this.password = password;
        this.platform = platform;
        this.getModel();
        this.getMasterKey(username);
    }
    private async getModel(){
        this.model = await db.getModel("Password");
    }
    private async getMasterKey(username:string) {
        const user = await findUser(this.model,username);
        this.masterKey = Buffer.from(user!.password);
    }
    public hash() {
        if(!this.masterKey){
            sendError("Error Ocurred Please Try Login Again",4);
            return;
        }
        const {iv} = Crypto.createSaltAndIV(16)
        this.password = Crypto.cipherData(this.password,this.masterKey,iv).concatenated
        this.hashed = true;
    }
    public async isNew(){
        const passModel = await db.getModel("Password")
        const pass = await getPassword(passModel,{username:this.username,platform:this.password})
        if(pass.length===0)return true
        this.hashed = true // already exists already hashed
        return false
    }
    public serializePassword(){
        return {
            username:this.username,
            password:this.password,
            platform:this.platform
        }
    }
    public async save() {
        if(await this.isNew()){
            if(!this.hashed){
                sendError("Check Your Input",3);
                return;
            }
            const password = this.serializePassword();
            await createPassword(this.model,password);
            sendNotification("Password Created")
        }
    }
    static hashMasterPassword(password:string){
        const { salt, iv } = Crypto.createSaltAndIV(16);
        const key = Crypto.createPBKDF2Key(password, salt);
        const hashedPass = Buffer.concat([salt,key]).toString("base64");
        return hashedPass;
    }
    static checkMasterPassword(password:string,hashedPassword:string,ivLen:number=16){
        const salt = Buffer.from(hashedPassword.slice(0, ivLen));
        const key = hashedPassword.slice(ivLen);
        return key === Crypto.createPBKDF2Key(password,salt).toString("base64")
    }
    
}