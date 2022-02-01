import { connect, Trilogy, Model, LooseObject, SchemaRaw } from "trilogy";
import { INote, IPassword, IPasswordDraft } from "./@types";
import { join } from "path";

//Schemas
const UserSchema: SchemaRaw = {
    username: { type: String, nullable: false, unique: true },
    password: { type: String, nullable: false },
    id: "increments",
};

const PasswordSchema: SchemaRaw = {
    platform: { type: String, nullable: false },
    username: { type: String, nullable: false },
    password: { type: String, nullable: false },
    id: "increments",
};

const NoteSchema: SchemaRaw = {
    title: { type: String, unique: true },
    note: { type: String, nullable: false },
    id: "increments",
};

//DB
export const connectDB = () => {
    return connect(join(__dirname, "..", "database.db"), { client: "sql.js" });
};

export const createModel = (db: Trilogy) => {
    const passwordModel = db.model("Password", PasswordSchema, {
        index: "platform",
        unique: ["platform", "username"],
        timestamps: true,
    });
    const userModel = db.model("User", UserSchema, {
        index: "username",
        timestamps: true,
    });
    const noteModel = db.model("Note", NoteSchema, { timestamps: true });
    return { passwordModel, userModel, noteModel };
};
// Password
export const getPassword = (db: Model<LooseObject>, pass: IPasswordDraft) => {
    const passwords = db.find(pass);
    return passwords;
};

export const createPassword = (db: Model<LooseObject>, pass: IPassword) => {
    const password = db.create(pass);
    return password;
};

export const updatePassword = (db: Model<LooseObject>,oldPass: IPasswordDraft,newPass: IPasswordDraft) => {
    const updated = db.update(oldPass, newPass);
    return updated;
};

export const deletePassword = (db: Model<LooseObject>, pass: IPasswordDraft) => {
    const deleted = db.remove(pass);
    return deleted;
};

// User
export const findUser = (db: Model<LooseObject>, username:string)=>{
    const user = db.findOne({username});
    return user
}

//Note
const findAllNotes = (db: Model<LooseObject>)=>{
    const notes = db.find()
    return notes
};

const findNote = (db: Model<LooseObject>,id:number)=>{
    const note = db.findOne({id})
    return note
};

const updateNote = (db: Model<LooseObject>, id:number,newInfo:INote)=>{
    const note = db.update({id},{newInfo})
    return note
};

const deleteNote = (db: Model<LooseObject>, id:number)=>{
    const note = db.remove({id})
    return note
};