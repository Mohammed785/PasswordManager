import { contextBridge, ipcRenderer } from "electron";
import { showMsg } from "../utils";

contextBridge.exposeInMainWorld("auth", {
    login: (username: string, password: string) => ipcRenderer.send("login", username, password),
    register: (username: string, password: string) => ipcRenderer.send("register", username, password),
    needAccount: () => ipcRenderer.send("load-register"),
    haveAccount: () => ipcRenderer.send("load-login"),
    forgetPass: () => {},
});

contextBridge.exposeInMainWorld("utils", {
    showMsg: (msg: string, isError: boolean) => showMsg(msg, isError),
});

ipcRenderer.on("error", (event, msg) => {
    showMsg(msg);
});

ipcRenderer.on("success", (event, msg) => {
    showMsg(msg, false);
});
