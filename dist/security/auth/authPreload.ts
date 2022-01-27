import { contextBridge, ipcRenderer } from "electron";
import {} from "crypto"
contextBridge.exposeInMainWorld("auth", {
    login: (username: string, password: string) => {ipcRenderer.send("login",username,password)},
    register: (username: string, password: string) => {ipcRenderer.send("register",username,password)},
    needAccount: () => {},
    haveAccount: () => {},
    forgetPass: () => {},
});
