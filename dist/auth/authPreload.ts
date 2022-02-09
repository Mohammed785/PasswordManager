import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("auth", {
    login: (username: string, password: string) => {ipcRenderer.send("login",username,password)},
    register: (username: string, password: string) => {ipcRenderer.send("register",username,password)},
    needAccount: () => {ipcRenderer.send("load-register")},
    haveAccount: () => {ipcRenderer.send("load-login")},
    forgetPass: () => {},
});

let errorArea:HTMLDivElement;
let container:HTMLDivElement;
let submitBtn:HTMLButtonElement;
let usernameInp:HTMLInputElement;
let passwordInp:HTMLInputElement;
let helpBtns: NodeListOf<HTMLButtonElement>;

window.addEventListener("DOMContentLoaded",e=>{
    errorArea = document.querySelector(".errors")!;
    container = document.querySelector(".container")!;
    submitBtn = document.getElementById("submit")! as HTMLButtonElement;
    usernameInp = document.getElementById("username")! as HTMLInputElement;
    passwordInp = document.getElementById("password")! as HTMLInputElement;
    helpBtns = document.querySelectorAll(".help-btn")!;
    
    submitBtn.addEventListener("click", (e) => {
        const username = usernameInp.value;
        const password = passwordInp.value;
        if (!username || !password) {
            showMsg("Please Enter Both Username And Password");
            return;
        }
        if ((e.target! as HTMLButtonElement).name === "login") {
            window.auth.login(username, password);
        } else {
            window.auth.register(username, password);
        }
    });

    helpBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const name = (e.target! as HTMLButtonElement).name;
            if (name === "forget") {
                //TODO:
            } else if (name === "need-acc") {
                window.auth.needAccount();
            } else if (name === "have-acc") {
                window.auth.haveAccount();
            } else {
                window.auth.forgetPass();
            }
        });
    });

})

ipcRenderer.on("error",(event,msg)=>{
    showMsg(msg)
})

ipcRenderer.on("success",(event,msg)=>{
    showMsg(msg,false)
})

const showMsg = (msg:string, isError = true) => {
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

