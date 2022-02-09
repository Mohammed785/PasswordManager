import { Crypto } from "../password/crypto";
import { Password } from "../password/password";
import { Model,LooseObject } from "trilogy";
import { sendMsg } from "../utils";
import { createUser } from "../db";

export const login = async (db: Model<LooseObject>,username: string,password: string) => {
    const user = await db.findOne({ username });
    if (!user) {
        sendMsg("Wrong Credentials");
        return;
    }
    if (!Password.checkMasterPassword(password, user.password)) {
        sendMsg("Wrong Credentials");
        return;
    }
    return user;
};

export const register = async (db:Model<LooseObject>,username:string,password:string)=>{
    const userExists = await db.findOne({ username });
    if (userExists) {
        sendMsg("User Already Exists");
        return;
    }
    const hashedPassword = Password.hashMasterPassword(password)
    const user = await createUser(db,username,hashedPassword);
    if(!user){
        sendMsg("Error Occurred While Saving Info Please Try Again Later")
        return;
    }
    return user;
}