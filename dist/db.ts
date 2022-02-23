import { connect, Trilogy, SchemaRaw } from "trilogy";
import { ICard, INote, INoteDraft, IPassword } from "./@types";
import { userModel, passwordModel, noteModel, cardModel } from "./main";
import { join } from "path";
import { Crypto } from "./crypto";

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
    expYear: { type: Number },
    expMonth: { type: Number },
    cvv: { type: String },
    name: { type: String },
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
    });
    const userModel = db.model("User", UserSchema, {
        index: "username",
    });
    const noteModel = db.model("Note", NoteSchema);
    const creditCardModel = db.model("Credit", CreditCardSchema);
    return { passwordModel, userModel, noteModel, creditCardModel };
};

// Password

export const getAllPasswords = () => {
    const passwords = passwordModel.find();
    return passwords;
};

export const getPassword = (id: number) => {
    const password = passwordModel.findOne({ id });
    return password;
};

export const createPassword = (data: IPassword) => {
    data = Crypto.hashPassword(data);
    const password = passwordModel.create(data);
    return password;
};

export const updatePassword = async (id: number, newData: IPassword) => {
    const old = await passwordModel.findOne({ id });
    if (old!.password !== newData.password) {
        return passwordModel.update({ id }, Crypto.hashPassword(newData));
    }
    return passwordModel.update({ id }, newData);
};

export const deletePassword = (id: number) => {
    const deleted = passwordModel.remove({ id });
    return deleted;
};

export const getPlatform = (platform: string) => {
    const passwords = passwordModel.find({ platform });
    return passwords;
};
export const deletePlatform = (platform: string) => {
    const passwords = passwordModel.remove({ platform });
    return passwords;
};

// User
export const findUser = (username: string) => {
    const user = userModel.findOne({ username });
    return user;
};

export const createUser = (username: string, password: string) => {
    const user = userModel.create({ username, password });
    return user;
};

//Note
export const findAllNotes = () => {
    const notes = noteModel.find();
    return notes;
};

export const findNote = (id: number) => {
    const note = noteModel.findOne({ id });
    return note;
};

export const createNote = (data: INote) => {
    const note = noteModel.create(data);
    return note;
};

export const updateNote = (id: number, newData: INoteDraft) => {
    const note = noteModel.update({ id }, newData);
    return note;
};

export const deleteNote = (id: number) => {
    const note = noteModel.remove({ id });
    return note;
};

// Card
export const findAllCards = () => {
    const cards = cardModel.find();
    return cards;
};

export const findCard = (id: number) => {
    const card = cardModel.findOne({ id });
    return card;
};

export const createCard = (data: ICard) => {
    data = Crypto.hashCardInfo(data);
    const card = cardModel.create(data);
    return card;
};

export const updateCard = async (id: number, newData: ICard) => {
    const old = await cardModel.findOne({ id })!;
    newData = Crypto.hashCardInfo(newData, old as ICard);
    const card = cardModel.update({ id }, newData);
    return card;
};

export const deleteCard = (id: number) => {
    const card = cardModel.remove({ id });
    return card;
};
