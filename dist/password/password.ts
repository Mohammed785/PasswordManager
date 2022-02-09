import { Crypto } from "./crypto";
import { db } from "../main";
import { createPassword, deletePassword, findUser, getPassword, updatePassword } from "../db";
import { Model,LooseObject } from "trilogy";
import { sendMsg } from "../utils";
import {IPasswordDraft} from "../@types"

// still need a lot work and changes
export class Password {
    static hashMasterPassword(password:string){
        const key = Crypto.createPBKDF2Key(password);
        const hashedPass = key.toString("base64");
        return hashedPass;
    }
    static checkMasterPassword(password:string,hashedPassword:string){
        const key = Buffer.from(hashedPassword,"base64");
        const enteredKey = Crypto.createPBKDF2Key(password);
        return key.toString("base64") === enteredKey.toString("base64");
    }
}