import { connect, Trilogy, Model, LooseObject } from "trilogy";
import { join } from "path";
import { Password, PasswordDraft } from "./@types";

export const connectDB = () => {
    return connect(join(__dirname,"..","database.db"), { client: "sql.js" });
};

const PasswordSchema = {
    platform: { type: String, nullable: false },
    username: { type: String, nullable: false },
    password: { type: String, nullable: false },
    id: "increments",
};

export const createModel =(db: Trilogy) => {
    const passwordModel = db.model("Password", PasswordSchema, {
        index: "platform",
        unique: ["platform", "username"],
    });
    return passwordModel;
};

export const getPassword = (db: Model<LooseObject>,pass: PasswordDraft) => {
    const passwords = db.find(pass);
    return passwords;
};

export const createPassword = (db: Model<LooseObject>,pass: Password) => {
    const password = db.create(pass)
    return password;
};

export const updatePassword = (db:Model<LooseObject>,oldPass:PasswordDraft,newPass:PasswordDraft)=>{
    const updated = db.update(oldPass, newPass);
    return updated;
}

export const deletePassword = (db: Model<LooseObject>,pass: PasswordDraft) => {
    const deleted = db.remove(pass); 
    return deleted;
};
