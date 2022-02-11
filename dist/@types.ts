export interface IUser {
    username: string;
    password: string;
}

export interface IPassword {
    platform: string;
    username: string;
    password: string;
}

export interface INote {
    title: string;
    note: string;
}

export interface ICard {
    company: string;
    cardNumber: string;
    ExpDate: Date;
    CVV: string;
}

export interface IPasswordDraft extends Partial<IPassword> {}
export interface ICardDraft extends Partial<ICard> {}
export interface INoteDraft extends Partial<INote> {}