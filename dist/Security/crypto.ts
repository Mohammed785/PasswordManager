import {randomBytes,pbkdf2Sync,createCipheriv,createDecipheriv} from "crypto";
import { IPassword } from "../@types";
import { currentUser } from "../main";
import { sendMsg } from "../utils";

export class Crypto{
    static createSaltAndIV(bytes:number=16){
        const salt:Buffer = randomBytes(bytes);
        const iv:Buffer = randomBytes(bytes);
        return {salt,iv};
    }
    static createPBKDF2Key(password:string,iterations:number=100000,keyLen:number=256/8,digest:string="sha256"):Buffer{
        const salt = Buffer.from(process.env.MASTER_SALT,"base64")
        return pbkdf2Sync(password, salt, iterations, keyLen, digest);
    };
    static cipherData(data:string,key:Buffer,iv:Buffer){
        const cipher = createCipheriv("aes-256-cbc",key,iv);
        cipher.write(data);
        cipher.end();
        const encryptedData:Buffer = cipher.read();
        return {
            encrypted: encryptedData.toString("base64"),
            concatenated: Buffer.concat([iv,encryptedData]).toString("base64")
        };
    };
    static decipherData(encrypted:string,key:string,bytesLen:number=16){
        const iv = key.slice(0,bytesLen);
        const decipher = createDecipheriv("aes-128-cbc",key,iv);
        return decipher
    }
    static getUserKey(){
        if(currentUser){
            return currentUser.password
        }
        sendMsg("Something Went Wrong!!! Try Again Later")
    }
    static hashPassword(password:IPassword){
        const {iv} = this.createSaltAndIV(16)
        const key = this.getUserKey()
        password.password = this.cipherData(password.password,Buffer.from(key,"base64"),iv).concatenated
        console.log("worked",password);
        return password
    }
    static hashMasterPassword(password:string){
        const key = this.createPBKDF2Key(password);
        const hashedPass = key.toString("base64");
        return hashedPass;
    }
    static checkMasterPassword(password:string,hashedPassword:string){
        const key = Buffer.from(hashedPassword,"base64");
        const enteredKey = this.createPBKDF2Key(password);
        return key.toString("base64") === enteredKey.toString("base64");
    }
}