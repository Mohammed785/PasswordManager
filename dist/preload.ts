import {contextBridge, ipcRenderer} from "electron";
import {IPassword,IPasswordDraft} from "./@types";

contextBridge.exposeInMainWorld(
    "api",{
        getAll:()=>ipcRenderer.send("getAll"),
        getPasswords:(criteria:IPasswordDraft)=>ipcRenderer.send("getPasswords",criteria),
        createPassword:(password:IPassword)=>ipcRenderer.send("createPassword",password),
        updatePassword:(criteria:IPasswordDraft,newPass:IPasswordDraft)=>ipcRenderer.send("updatePassword",criteria,newPass),
        deletePassword:(criteria:IPasswordDraft)=>ipcRenderer.send("deletePassword",criteria),
        deletePlatform:(criteria:IPasswordDraft)=>{
            ipcRenderer.send("ask-confirm",criteria)
        }
    }
)

let infoArea: HTMLTextAreaElement;

window.addEventListener("DOMContentLoaded",()=>{
    infoArea = document.getElementById("info-area") as HTMLTextAreaElement;
});

const showPasswordInfo = (password: IPassword,all=false) => {
    if(!all)infoArea.value = "";
    if (!password) {
        infoArea.value = "Not Found";
        return;
    }
    infoArea.value += `---------------------------------------------\nPlatform: ${password!.platform}\nUsername: ${password.username}\nPassword: ${password.password}\n---------------------------------------------\n`;
};

const showErrorMsg = (msg:string)=>{
    infoArea.value = msg;
}
const clearInput = ()=>{
    const platformInput = document.getElementById("platform") as HTMLInputElement;
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    platformInput.value = "";
    usernameInput.value = "";
    passwordInput.value = "";
}
ipcRenderer.on("gotPassword",(event,data)=>{
    if(data.length===0){
        showErrorMsg("IPassword Not Found")
        return;
    }
    data.forEach((element: IPassword,idx:number) => {
        const First = (idx === 0) ?  false: true;
        showPasswordInfo(element, First);
    });
});

ipcRenderer.on("created",(event,data)=>{
    clearInput()
    if(data===undefined){
        showErrorMsg("Already Created")
        return;
    }
    showPasswordInfo(data);
});

ipcRenderer.on("updated",(event,data)=>{
    clearInput()
    if(data.length!=0){
        infoArea.value = "Updated Successfully"
    }else{
        infoArea.value = "Update Failed"
    }
})
ipcRenderer.on("deleted",(event,data)=>{
    clearInput()
    if(data.length!=0){
        infoArea.value = "Deleted Successfully"
    }else{
        infoArea.value = "Delete Failed"
    }
})

ipcRenderer.on("Error",(event,error)=>{
    clearInput()
    infoArea.value = `Error: ${error}`
})