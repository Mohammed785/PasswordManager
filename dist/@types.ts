export interface IUser {
    username: string;
    password: string;
}

export interface IPassword {
    id?: number;
    platform: string;
    username: string;
    password: string;
}

export interface INote {
    id?: number;
    title: string;
    note: string;
}

export interface ICard {
    id?: number;
    company: string;
    cardNumber: string;
    expYear: number;
    expMonth: number;
    cvv: string;
    name: string;
}

export interface IPasswordDraft extends Partial<IPassword> {}
export interface ICardDraft extends Partial<ICard> {}
export interface INoteDraft extends Partial<INote> {}
