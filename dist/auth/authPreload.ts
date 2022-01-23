import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("auth",{
    login:()=>{},
    register:()=>{},
    needAccount:()=>{},
    haveAccount:()=>{},
    forgetPass:()=>{}
})
