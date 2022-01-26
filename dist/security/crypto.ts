import {randomBytes,pbkdf2Sync,createCipheriv,createDecipheriv} from "crypto";

export class Crypto{
    static createSaltAndIV(bytes:number=16){
        const salt:Buffer = randomBytes(bytes);
        const iv:Buffer = randomBytes(bytes);
        return {salt,iv};
    }
    static createPBKDF2Key(password:string,salt:Buffer,iterations:number=100000,keyLen:number=256/8,digest:string="sha256"):Buffer{
        const key = pbkdf2Sync(password,salt,iterations,keyLen,digest);
        return key;
    };
    static cipherData(data:string,key:Buffer,iv:Buffer){
        const cipher = createCipheriv("aes-256-cbc",key,iv);
        cipher.write(data);
        cipher.end();
        const encryptedData:Buffer = cipher.read();
        return {
            encrypted: encryptedData.toString("base64"),
            concatenated: Buffer.concat([iv,key,encryptedData]).toString("base64")
        };
    };
    static decipherData(encrypted:string,key:string,bytesLen:number=16){
        const iv = key.slice(0,bytesLen);
        const decipher = createDecipheriv("aes-128-cbc",key,iv);
        return decipher
    }
}