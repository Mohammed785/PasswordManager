import {contextBridge, ipcRenderer} from "electron";
import { IPassword,IPasswordDraft,ICard,ICardDraft,INote,INoteDraft } from "../@types";

contextBridge.exposeInMainWorld("password",{
    getAll:()=>ipcRenderer.send("getAllPasswords"),
    getPassword:(id:number)=>ipcRenderer.send("getPasswords",id),
    createPassword:(data:IPassword)=>ipcRenderer.send("createPassword",data),
    updatePassword:(id:number,newData:IPasswordDraft)=>ipcRenderer.send("updatePassword",id,newData),
    deletePassword:(id:number)=>ipcRenderer.send("deletePassword",id),
    getPlatform:(platform:string)=>ipcRenderer.send("getPlatform",platform),
    deletePlatform:(platform:number)=>ipcRenderer.send("ask-confirm",platform)
})

contextBridge.exposeInMainWorld("note",{
    getAll:()=>ipcRenderer.send("getAllNotes"),
    getNote:(id:number)=>ipcRenderer.send("getNote",id),
    createNote:(data:INote)=>ipcRenderer.send("createNote",data),
    updateNote:(id:number,newData:INoteDraft)=>ipcRenderer.send("updateNote",id,newData),
    deleteNote:(id:number)=>ipcRenderer.send("DeleteNote",id)
})

contextBridge.exposeInMainWorld("credit",{
    getAll:()=>ipcRenderer.send("getAllCards"),
    getCard:(id:number)=>ipcRenderer.send("getCard",id),
    createCard:(data:ICard)=>ipcRenderer.send("createCard",data),
    updateCard:(id:number,newData:ICardDraft)=>ipcRenderer.send("updateCard",id,newData),
    deleteCard:(id:number)=>ipcRenderer.send("DeleteCard",id)
});

contextBridge.exposeInMainWorld("utils",{

})

// events
//  password
ipcRenderer.on("gotAllPasswords",(event,data)=>{

})

ipcRenderer.on("gotPassword",(event,data)=>{
    
});

ipcRenderer.on("createdPassword",(event,data)=>{
    
});

ipcRenderer.on("updatedPassword",(event,data)=>{
    
})
ipcRenderer.on("deletedPassword",(event,data)=>{
    
})

ipcRenderer.on("error",(event,error)=>{
    
})
ipcRenderer.on("success",(event,error)=>{
    
})
// note
ipcRenderer.on("gotAllNotes",(event,data)=>{

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

})

ipcRenderer.on("gotCredit",(event,data)=>{
    
});

ipcRenderer.on("createdCredit",(event,data)=>{
    
});

ipcRenderer.on("updatedCredit",(event,data)=>{
    
})
ipcRenderer.on("deletedCredit",(event,data)=>{
    
})

ipcRenderer.on("error",(event,error)=>{
    
})

ipcRenderer.on("success",(event,error)=>{
    
})