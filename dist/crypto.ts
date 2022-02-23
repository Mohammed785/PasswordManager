import {randomBytes,pbkdf2Sync,createCipheriv,createDecipheriv} from "crypto";
import { ICard, IPassword } from "./@types";
import { currentUser } from "./main";

export class Crypto{
    static createSaltAndIV(bytes:number=16){
        const salt:Buffer = randomBytes(bytes);
        const iv:Buffer = randomBytes(bytes);
        return {salt,iv};
    }
    static createPBKDF2Key(password:string,salt:Buffer):Buffer{
        const key = pbkdf2Sync(password, salt, 100000, 256 / 8, "sha256");
        return Buffer.concat([salt,key])
    };
    static cipherData(data:string,key:Buffer){
        const iv = randomBytes(16);
        const cipher = createCipheriv("aes-256-cbc",key,iv);
        cipher.write(data);
        cipher.end();
        const encryptedData:Buffer = cipher.read();
        return Buffer.concat([iv,encryptedData]).toString("base64")
    };
    static decipherData(encrypted:string){
        const encryptedBuffer = Buffer.from(encrypted,"base64")
        const key = this.getUserKey()!
        const iv = encryptedBuffer.slice(0,16)
        const decipher = createDecipheriv("aes-256-cbc",key,iv);
        decipher.write(encryptedBuffer.slice(16));
        decipher.end()
        const decrypted = decipher.read()
        return decrypted.toString()
    }
    static getUserKey(){
        const enc = Buffer.from(currentUser!.password,"base64");
        return enc.slice(16)
    }
    static hashCardInfo(card:ICard,old?:ICard):ICard {
        const key  = this.getUserKey()!
        if(old){
            if(old.cardNumber!==card.cardNumber)card.cardNumber = this.cipherData(card.cardNumber, key);
            if(old.cvv!==card.cvv)card.cvv = this.cipherData(card.cvv, key);
            return card
        }
        card.cardNumber = this.cipherData(card.cardNumber, key);
        card.cvv = this.cipherData(card.cvv,key);
        return card
    }
    static hashPassword(password:IPassword) {
        const key = this.getUserKey()!
        password.password = this.cipherData(password.password,key);
        return password
    }
    static hashMasterPassword(password:string){
        const key = this.createPBKDF2Key(password,randomBytes(16));
        const hashedPass = key.toString("base64");
        return hashedPass;
    }
    static checkMasterPassword(password:string,hashedPassword:string){
        const keyBuffer = Buffer.from(hashedPassword,"base64");
        const salt = keyBuffer.slice(0,16);
        const key = keyBuffer.slice(16);
        const enteredKey = this.createPBKDF2Key(password,salt);
        return key.toString("base64") === enteredKey.slice(16).toString("base64");
    }
}