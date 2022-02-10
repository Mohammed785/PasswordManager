import { connect, Trilogy, SchemaRaw } from "trilogy";
import { INote, IPassword, IPasswordDraft } from "./@types";
import { join } from "path";
import { userModel, passwordModel, noteModel, cardModel } from "./main"

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

const CreditCardSchema: SchemaRaw = {
    company: { type: String },
    cardNumber: { type: String },
    ExpDate: { type: Date },
    CVV: { type: String },
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
    const CreditCardModel = db.model("Credit", CreditCardSchema,{timestamps:true})
    return { passwordModel, userModel, noteModel };
};

// Password
export const getPassword = (pass: IPasswordDraft) => {
    const passwords = passwordModel.find(pass);
    return passwords;
};

export const createPassword = (pass: IPassword) => {
    const password = passwordModel.create(pass);
    return password;
};

export const updatePassword = (oldPass: IPasswordDraft,newPass: IPasswordDraft) => {
    const updated = passwordModel.update(oldPass, newPass);
    return updated;
};

export const deletePassword = (pass: IPasswordDraft) => {
    const deleted = passwordModel.remove(pass);
    return deleted;
};

// User
export const findUser = (username:string)=>{
    const user = userModel.findOne({username});
    return user
}

export const createUser = (username:string, password:string) => {
    const user = userModel.create({username,password})
    return user
}

//Note
export const findAllNotes = ()=>{
    const notes = noteModel.find()
    return notes
};

export const findNote = (id:number)=>{
    const note = noteModel.findOne({id})
    return note
};

export const updateNote = (id:number,newInfo:INote)=>{
    const note = noteModel.update({id},{newInfo})
    return note
};

export const deleteNote = (id:number)=>{
    const note = noteModel.remove({id})
    return note
};

// Card
export const findAllCards = ()=>{
    const cards = cardModel.find()
    return cards
}

const findCard = (id:number)=>{
    const card = cardModel.findOne({id})
    return card
}

export const updateCard = (id: number, newInfo: INote) => {
    const note = cardModel.update({ id }, { newInfo });
    return note;
};

export const deleteCard = (id: number) => {
    const note = cardModel.remove({ id });
    return note;
};
