import { ICard, ICardDraft, INote, INoteDraft, IPassword, IPasswordDraft } from "./@types";
declare global {
    interface Window {
        password: {
            getAll: () => void;
            getPassword: (id: number) => void;
            createPassword: (data: IPassword) => void;
            updatePassword: (id: number, newData: IPasswordDraft) => void;
            deletePassword: (id: number) => void;
            getPlatform: (platform: string) => void;
            deletePlatform: (platform: number) => void;
            copyPassword: (password: string) => void;
            getTemplate: () => string;
        };
        note: {
            getAll: () => void;
            getNote: (id: number) => void;
            createNote: (data: INote) => void;
            updateNote: (id: number, newData: INoteDraft) => void;
            deleteNote: (id: number) => void;
            getTemplate: () => string;
        };
        credit: {
            getAll: () => void;
            getCard: (id: number) => void;
            createCard: (data: ICard) => void;
            updateCard: (id: number, newData: ICardDraft) => void;
            deleteCard: (id: number) => void;
            getTemplate: () => string;
        };
        auth: {
            login: (username: string, password: string) => void;
            register: (username: string, password: string) => void;
            needAccount: () => void;
            haveAccount: () => void;
            forgetPass: () => void;
        };
        utils: {
            showMsg: (msg: string, isError: boolean) => void;
            getCurrent: () => ICard | INote | IPassword;
        };
    }
}

export {};
