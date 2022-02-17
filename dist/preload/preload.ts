import {contextBridge, ipcRenderer} from "electron";
import { IPassword,IPasswordDraft,ICard,ICardDraft,INote,INoteDraft } from "../@types";
import { showMsg } from "../utils";

contextBridge.exposeInMainWorld("password",{
    getAll:()=>ipcRenderer.send("getAllPasswords"),
    getPassword:(id:number)=>ipcRenderer.send("getPasswords",id),
    createPassword:(data:IPassword)=>ipcRenderer.send("createPassword",data),
    updatePassword:(id:number,newData:IPasswordDraft)=>ipcRenderer.send("updatePassword",id,newData),
    deletePassword:(id:number)=>ipcRenderer.send("deletePassword",id),
    getPlatform:(platform:string)=>ipcRenderer.send("getPlatform",platform),
    deletePlatform:(platform:number)=>ipcRenderer.send("ask-confirm",platform),
    getTemplate:()=>`${passwordMain}${createBtn}`
})

contextBridge.exposeInMainWorld("note",{
    getAll:()=>ipcRenderer.send("getAllNotes"),
    getNote:(id:number)=>ipcRenderer.send("getNote",id),
    createNote:(data:INote)=>ipcRenderer.send("createNote",data),
    updateNote:(id:number,newData:INoteDraft)=>ipcRenderer.send("updateNote",id,newData),
    deleteNote:(id:number)=>ipcRenderer.send("deleteNote",id),
    getTemplate:()=>`${noteMain}${createBtn}`
})

contextBridge.exposeInMainWorld("credit",{
    getAll:()=>ipcRenderer.send("getAllCards"),
    getCard:(id:number)=>ipcRenderer.send("getCard",id),
    createCard:(data:ICard)=>ipcRenderer.send("createCard",data),
    updateCard:(id:number,newData:ICardDraft)=>ipcRenderer.send("updateCard",id,newData),
    deleteCard:(id:number)=>ipcRenderer.send("DeleteCard",id),
    getTemplate:()=>`${bankMain}${createBtn}`
});

contextBridge.exposeInMainWorld("utils",{
    showMsg:(msg:string,isError:boolean)=>showMsg(msg,isError),
    getCurrent:()=>current
})
let dataListSection:HTMLDivElement;
let dataSection:HTMLDivElement;
let dataList:HTMLUListElement;
let current:ICard|IPassword|INote;
// events
window.onload = ()=>{
    dataListSection =  document.querySelector(".data-list-section")!;
    dataSection = document.querySelector(".data-section")!;
    dataList = document.querySelector(".list")!;
}
const checkUndefined = (data:Array<any>)=>{
    if(data===undefined || !data.length)return false
    return true
}
//  password
ipcRenderer.on("gotAllPasswords",(event,data)=>{
    if(!checkUndefined(data)){
        dataList.innerHTML = `<p class='not-found'>Nothing To Show</p>`;
        return
    }
    const newData = data.map((password:IPassword)=>{
        return passwordTemplate(password, true).split("\n").join("");
    })
    dataList.innerHTML = newData.join("")
})

ipcRenderer.on("gotPassword",(event,password:IPassword)=>{
    const temp = passwordTemplate(password);
    dataSection.innerHTML = temp;
    current = password
});

ipcRenderer.on("createdPassword",(event,data:IPassword)=>{
    dataList.innerHTML+= passwordTemplate(data,true)
});

ipcRenderer.on("updatedPassword",(event,data)=>{
    current = data
    showMsg("Password Updated Successfully",false)
})
ipcRenderer.on("deletedPassword",(event,id)=>{
    const child = document.getElementById(id)!;
    dataList.removeChild(child);
})

// note
ipcRenderer.on("gotAllNotes",(event,data)=>{
    if (!checkUndefined(data)) {
        dataListSection.innerHTML = `<p class='not-found'>Nothing To Show</p>`;
        return;
    }
    const newData = data.map((note: INote) => {
        return noteTemplate(note, true).split("\n").join("");
    });
    dataListSection.innerHTML = newData.join("");
})

ipcRenderer.on("gotNote",(event,data)=>{
    
});

ipcRenderer.on("createdNote",(event,data)=>{
    
});

ipcRenderer.on("updatedNote",(event,data)=>{
    
})
ipcRenderer.on("deletedNote",(event,data)=>{
    
})

//bank
ipcRenderer.on("gotAllCredits",(event,data)=>{
    if (!checkUndefined(data)) {
        dataListSection.innerHTML = `<p class='not-found'>Nothing To Show</p>`;
        return;
    }
    const newData = data.map((card: ICard) => {
        return creditTemplate(card, true).split("\n").join("");
    });
    dataListSection.innerHTML = newData.join("");
})

ipcRenderer.on("gotCredit",(event,data)=>{
    
});

ipcRenderer.on("createdCredit",(event,data)=>{

});

ipcRenderer.on("updatedCredit",(event,data)=>{
    
})
ipcRenderer.on("deletedCredit",(event,data)=>{
    
})


ipcRenderer.on("error", (event, msg) => {
    showMsg(msg);
});

ipcRenderer.on("success", (event, msg) => {
    showMsg(msg, false);
});

// main page html template
const passwordMain:string = `<div class="input-section">
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
                    <option value="Disney+">Disney+</option>
                    <option value="HBO">HBO</option>
                </select>
                <input type="text" class="input" placeholder="Username or Email" name="username" id="username" required>
                <input type="password" class="input" placeholder="Password" name="password" id="password" required>
            </div>`;

const bankMain:string = `<div class="input-section">
                <select name="company" id="company" class="input" required>
                    <option value="MasterCard">MasterCard</option>
                    <option value="Visa">Visa</option>
                    <option value="AmericanExpress">AmericanExpress</option>
                </select>
                <input type="text" class="input" placeholder="Card Number" name="cardNumber" id="cardNumber" required>
                <input type="date" class="input" placeholder="Expire Date" name="expDate" id="expDate" required>
                <input type="text" class="input" placeholder="CVV" name="cvv" id="cvv"  maxlength="3" required>
            </div>`;

const noteMain:string = `<div class="input-section">
                <input type="text" class="input" placeholder="Title for the note" name="title" id="noteTitle" required>
                <textarea name="note" id="noteBody" placeholder="Note" cols="30" rows="10"></textarea>
            </div>`;

const createBtn = `<div class="btn-section">
                <button class="btn" id="create">Create</button>
            </div>`;

const btnSection = (id:number)=>`<div class="btn-section">
                <button class="btn" id="delete" data-id=${id}>Delete</button>
                <button class="btn" id="update" data-id=${id}>Update</button>
            </div>`;

const passwordTemplate = (password:IPassword,list=false)=>{
    if(list){
        return `<li class="item" id="${password.id}">
<img class="item-image" src="../images/${password.platform}.png" alt="">
<div class="item-data">
<p class="item-name">${password.username.slice(0,13)}...</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/${password.platform}.png" alt="">
<!---<span class="circle__back-1"></span>
<span class="circle__back-2"></span>--->
</div>
            ${passwordMain}
            ${btnSection(password.id as number)}`;
};
const noteTemplate = (note:INote,list=false)=>{
    if(list){
        return `<li class="item">
<img class="item-image" src="../images/Note.png" alt="">
<div class="item-data">
<p class="item-name">${note.title.slice(0,13)}...</p>
<p class="item-info">${note.note.slice(0,15)}...</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/Note.png" alt="">
<!---<span class="circle__back-1"></span>
<span class="circle__back-2"></span>--->
</div>
${noteMain}
${btnSection(note.id as number)}`;
};
const creditTemplate = (credit:ICard,list=false)=>{
    if(list){
        return `<li class="item">
<img class="item-image" src="../images/${credit.company}.png" alt="">
<div class="item-data">
<p class="item-name">${credit.cardNumber.slice(0,4)}-xxxx...</p>
</div>
</li>`;
    }
    return `<span class="close">x</span>
<div class="logo-cont">
<img class="data-img" src="../images/${credit.company}.png" alt="">
<!---<span class="circle__back-1"></span>
<span class="circle__back-2"></span>--->
</div>
${bankMain}
${btnSection(credit.id as number)}`;
};