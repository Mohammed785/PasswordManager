import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("auth", {
    login: (username: string, password: string) => {ipcRenderer.send("login",username,password)},
    register: (username: string, password: string) => {ipcRenderer.send("register",username,password)},
    needAccount: () => {ipcRenderer.send("load-register")},
    haveAccount: () => {ipcRenderer.send("load-login")},
    forgetPass: () => {},
    showMsg:(msg:string,isError:boolean)=>{showMsg(msg,isError)}
});

ipcRenderer.on("error",(event,msg)=>{
    showMsg(msg)
})

ipcRenderer.on("success",(event,msg)=>{
    showMsg(msg,false)
})

const showMsg = (msg:string, isError = true) => {
    const errorArea = document.querySelector(".errors") as HTMLDivElement;
    const container = document.querySelector(".container") as HTMLDivElement;
    errorArea.innerHTML += `
    <div class="error-msg ${isError ? "error" : "success"}">
            <span class="close">&times;</span>
            ${msg}
    </div>
    `;
    while (errorArea.offsetHeight + 40 > container.offsetTop) {
        errorArea.removeChild(errorArea.children[0]);
    }
    const close = document.querySelectorAll(".close");
    close.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            errorArea.removeChild((e.target as HTMLButtonElement).parentElement!);
        });
    });
};

