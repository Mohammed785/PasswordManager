import {contextBridge, ipcRenderer} from "electron";
import { IPassword,IPasswordDraft,ICard,ICardDraft,INote,INoteDraft } from "./@types";

contextBridge.exposeInMainWorld("password",{
    getAll:()=>ipcRenderer.send("getAll"),
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

ipcRenderer.on("gotPassword",(event,data)=>{
    
});

ipcRenderer.on("created",(event,data)=>{
    
});

ipcRenderer.on("updated",(event,data)=>{
    
})
ipcRenderer.on("deleted",(event,data)=>{
    
})

ipcRenderer.on("Error",(event,error)=>{
    
})