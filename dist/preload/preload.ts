import { contextBridge, ipcRenderer } from "electron";
import { IPassword, IPasswordDraft, ICard, ICardDraft, INote, INoteDraft } from "../@types";
import { showMsg } from "../utils";

contextBridge.exposeInMainWorld("password", {
    getAll: () => ipcRenderer.send("getAllPasswords"),
    getPassword: (id: number) => ipcRenderer.send("getPasswords", id),
    createPassword: (data: IPassword) => ipcRenderer.send("createPassword", data),
    updatePassword: (id: number, newData: IPasswordDraft) => ipcRenderer.send("updatePassword", id, newData),
    deletePassword: (id: number) => ipcRenderer.send("deletePassword", id),
    getTemplate: () => `${passwordMain}${createBtn}`,
});

contextBridge.exposeInMainWorld("note", {
    getAll: () => ipcRenderer.send("getAllNotes"),
    getNote: (id: number) => ipcRenderer.send("getNote", id),
    createNote: (data: INote) => ipcRenderer.send("createNote", data),
    updateNote: (id: number, newData: INoteDraft) => ipcRenderer.send("updateNote", id, newData),
    deleteNote: (id: number) => ipcRenderer.send("deleteNote", id),
    getTemplate: () => `${noteMain}${createBtn}`,
});

contextBridge.exposeInMainWorld("credit", {
    getAll: () => ipcRenderer.send("getAllCards"),
    getCard: (id: number) => ipcRenderer.send("getCard", id),
    createCard: (data: ICard) => ipcRenderer.send("createCard", data),
    updateCard: (id: number, newData: ICardDraft) => ipcRenderer.send("updateCard", id, newData),
    deleteCard: (id: number) => ipcRenderer.send("deleteCard", id),
    getTemplate: () => `${bankMain}${createBtn}`,
});

contextBridge.exposeInMainWorld("utils", {
    showMsg: (msg: string, isError: boolean) => showMsg(msg, isError),
    getCurrent: () => current,
    copyHashed: (encrypted: string) => ipcRenderer.send("copyHashed", encrypted)
});

let dataSection: HTMLDivElement;
let dataList: HTMLUListElement;
let current: ICard | IPassword | INote;
// events
window.onload = () => {
    dataSection = document.querySelector(".data-section")!;
    dataList = document.querySelector(".list")!;
};
const checkUndefined = (data: Array<any>) => {
    if (data === undefined || !data.length) return false;
    return true;
};
//  password
ipcRenderer.on("gotAllPasswords", (event, data) => {
    if (!checkUndefined(data)) {
        dataList.innerHTML = `<p class='not-found'>No Passwords Found</p>`;
        return;
    }
    const newData = data.map((password: IPassword) => {
        return passwordTemplate(password, true);
    });
    dataList.innerHTML = newData.join("");
});

ipcRenderer.on("gotPassword", (event, password: IPassword) => {
    const temp = passwordTemplate(password);
    dataSection.innerHTML = temp;
    current = password;
});

ipcRenderer.on("createdPassword", (event, data: IPassword) => {
    dataList.innerHTML += passwordTemplate(data, true);
});

ipcRenderer.on("updatedPassword", (event, data) => {
    current = data[0];
    showMsg("Password Updated Successfully", false);
});
ipcRenderer.on("deletedPassword", (event, id) => {
    const child = document.getElementById(id)!;
    dataList.removeChild(child);
});
ipcRenderer.on("copied", (event, decrypted) => {
    showMsg("Copied Successfully", false);
    navigator.clipboard.writeText(decrypted);
});

// note
ipcRenderer.on("gotAllNotes", (event, notes) => {
    if (!checkUndefined(notes)) {
        dataList.innerHTML = `<p class='not-found'>No Notes Found</p>`;
        return;
    }
    const notesTemplate = notes.map((note: INote) => {
        return noteTemplate(note, true);
    });
    dataList.innerHTML = notesTemplate.join("");
});

ipcRenderer.on("gotNote", (event, note) => {
    const temp = noteTemplate(note);
    dataSection.innerHTML = temp;
    current = note;
});

ipcRenderer.on("createdNote", (event, note) => {
    dataList.innerHTML += noteTemplate(note, true);
});

ipcRenderer.on("updatedNote", (event, note) => {
    current = note[0];
    showMsg("Note Updated Successfully", false);
});
ipcRenderer.on("deletedNote", (event, id) => {
    const child = document.getElementById(id)!;
    dataList.removeChild(child);
});

//bank
ipcRenderer.on("gotAllCards", (event, data) => {
    if (!checkUndefined(data)) {
        dataList.innerHTML = `<p class='not-found'>No Cards Found</p>`;
        return;
    }
    const newData = data.map((card: ICard) => {
        return creditTemplate(card, true);
    });
    dataList.innerHTML = newData.join("");
});

ipcRenderer.on("gotCard", (event, card) => {
    const temp = creditTemplate(card);
    dataSection.innerHTML = temp;
    current = card;
});

ipcRenderer.on("createdCard", (event, card) => {
    dataList.innerHTML += creditTemplate(card, true);
});

ipcRenderer.on("updatedCard", (event, card) => {
    current = card[0];
    showMsg("Card Updated Successfully", false);
});
ipcRenderer.on("deletedCard", (event, id) => {
    const child = document.getElementById(id)!;
    dataList.removeChild(child);
});

ipcRenderer.on("error", (event, msg) => {
    showMsg(msg);
});

ipcRenderer.on("success", (event, msg) => {
    showMsg(msg, false);
});

// main page html template
const passwordMain: string = `<div class="input-section">
                <div class="input-group">
                <label for="platform">Platform: </label>
                <select name="platform" id="platform" class="input" required>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Apple">Apple</option>
                    <option value="Github">Github</option>
                    <option value="StackOverflow">StackOverflow</option>
                    <option value="Slack">Slack</option>
                    <option value="Discord">Discord</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Disney">Disney+</option>
                    <option value="HBO">HBO</option>
                </select>
                </div>
                <div class="input-group">
                <label for="username">Username: </label>
                <input type="text" class="input" placeholder="Username or Email" name="username" id="username" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
                <div class="input-group">
                <label for="password">Password: </label>
                <input type="password" class="input" placeholder="Password" name="password" id="password" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
            </div>`;

const bankMain: string = `<div class="input-section">
                <div class="input-group">
                <label for="company">Company: </label>
                <select name="company" id="company" class="input" required>
                    <option value="MasterCard">MasterCard</option>
                    <option value="Visa">Visa</option>
                    <option value="AmericanExpress">AmericanExpress</option>
                </select>
                </div>
                <div class="input-group">
                <label for="name">Name: </label>
                <input type="text" class="input" placeholder="Card Name (helps to differentiate between cards)" name="name" id="name" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
                <div class="input-group">
                <label for="cardNumber">Card Number: </label>
                <input type="password" class="input" placeholder="Card Number" name="cardNumber" maxlength="16" id="cardNumber" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
                <div class="input-group">
                <label for="cvv">CVV: </label>
                <input type="password" class="input" placeholder="CVV" name="cvv" id="cvv"  maxlength="3" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
                <div class="input-group dates">
                <label for="expYear">Year: </label>
                <input type="text" class="input" placeholder="YY" name="expYear" maxlength="2" id="expYear" required>
                <label for="expMonth">Month: </label>
                <input type="text" class="input" placeholder="MM" name="expMonth" maxlength="2" id="expMonth" required>
                <svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                </div>
            </div>`;

const noteMain: string = `<div class="input-section">
                <div class="input-group">
                <label for="title">Title: </label>           
                <input type="text" class="input" placeholder="Title for the note" name="title" id="title" required>
                </div>
                <div class="input-group">
                <label for="note">Note: </label>
                <textarea name="note" class="input" id="note" placeholder="Note" cols="30" rows="10"></textarea>
                </div>
            </div>`;

const createBtn = `<div class="btn-section">
                <button class="btn" id="create">Create</button>
            </div>`;

const btnSection = (id: number) => `<div class="btn-section">
                <button class="btn" id="delete" data-id=${id}>Delete</button>
                <button class="btn" id="update" data-id=${id}>Update</button>
            </div>`;

const passwordTemplate = (password: IPassword, list = false) => {
    if (list) {
        const username = password.username;
        return `<li class="item" id="${password.id}">
<img class="item-image" src="../images/${password.platform}.png" alt="">
<div class="item-data">
<p class="item-name">${
            username.length > 13 ? `${username.slice(0, 13)}...` : username
        }</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/${password.platform}.png" alt="">
<span class="circle__back-1"></span>
<span class="circle__back-2"></span>
</div>
            ${passwordMain}
            ${btnSection(password.id as number)}`;
};
const noteTemplate = (note: INote, list = false) => {
    if (list) {
        const title = note.title;
        const body = note.note;
        return `<li class="item" id=${note.id}>
<img class="item-image" src="../images/Note.png" alt="">
<div class="item-data">
<p class="item-name">${
            title.length > 13 ? `${title.slice(0, 13)}...` : title
        }</p>
<p class="item-info">${body.length > 15 ? `${body.slice(0, 15)}...` : body}</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/Note.png" alt="">
<span class="circle__back-1"></span>
<span class="circle__back-2"></span>
</div>
${noteMain}
${btnSection(note.id as number)}`;
};
const creditTemplate = (credit: ICard, list = false) => {
    if (list) {
        const name = credit.name;
        return `<li class="item" id=${credit.id}>
<img class="item-image" src="../images/${credit.company}.png" alt="">
<div class="item-data">
<p class="item-name">${name.length > 13 ? `${name.slice(0, 13)}...` : name}</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/${credit.company}.png" alt="">
<span class="circle__back-1"></span>
<span class="circle__back-2"></span>
</div>
${bankMain}
${btnSection(credit.id as number)}`;
};
