import {config} from "dotenv"
config()
import { app, BrowserWindow, ipcMain, IpcMainEvent, dialog } from "electron";
import { connectDB, createModel, getPassword, createPassword, updatePassword, deletePassword, getAllPasswords } from "./db";
import { login, register } from "./auth";
import { LooseObject, Model, Trilogy } from "trilogy";
import { sendMsg, tryCatch } from "./utils";
import { join } from "path";
import { INote, IPassword, IPasswordDraft } from "./@types";

export let passwordModel: Model<LooseObject>;
export let userModel: Model<LooseObject>;
export let noteModel: Model<LooseObject>;
export let cardModel: Model<LooseObject>;
export let currentUser: LooseObject|undefined;
export let db: Trilogy;

const createWindow = () => {
    const mainWin = new BrowserWindow({
        width: 1100,
        height: 900,
        center: true,
        show:false,
        webPreferences: {
            preload: join(__dirname,"preload", "preload.js"),
            nodeIntegration: true,
            safeDialogs: true,
        },
    });
    mainWin.loadFile(join(__dirname, "..", "static", "html", "main.html"));
    const authWin = new BrowserWindow({
        width: 1100,
        height: 900,
        center: true,
        webPreferences: {
            preload: join(__dirname,"preload","authPreload.js"),
            nodeIntegration: true,
            safeDialogs: true,
        },
    });
    authWin.loadFile(join(__dirname, "..", "static", "html", "login.html"));
};


ipcMain.on("ask-confirm", (event, arg) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow()!, {
            message:"Check Your Input You May Delete Entire Platform Are You Sure",
            type: "warning",
            buttons: ["Yes", "No"],
        }).then(async(res) => {
            if(res.response===1){
                event.reply('Error','Delete Cancelled');
            }else{
                const data = await deletePassword(arg);
                event.reply("deleted",data);
            }
        }).catch((e) => event.reply("Error",e));
});

ipcMain.on("load-login",()=>{
    BrowserWindow.getAllWindows()[0].loadFile(join(__dirname,"..","static","html","login.html"))
})
ipcMain.on("load-register",()=>{
    BrowserWindow.getAllWindows()[0].loadFile(join(__dirname,"..","static","html","register.html"))
})

ipcMain.on("login",tryCatch(async (event:IpcMainEvent,username:string,password:string)=>{
    const user = await login(userModel,username,password)
    if(user){
        BrowserWindow.getAllWindows()[0].hide()
        BrowserWindow.getAllWindows()[1].show()
        currentUser = user;
        sendMsg(`Welcome Back ${user.username}`,false)
    }
}))

ipcMain.on("logout",(event)=>{
    if(!currentUser){
        sendMsg("You Need To Login First")
    }else{
        currentUser = undefined;
        sendMsg("Logged Out Successfully",false)
    }
})

ipcMain.on("register",async(event,username,password)=>{
    const user = await register(userModel,username,password)
    if(user){
        BrowserWindow.getAllWindows()[0].loadFile(join(__dirname,"..","static","html","login.html"))
        sendMsg("Account Created You can login", false);
    }else{
        sendMsg("Error Occurred!!! While Saving Your Info Try Again Please")
    }
})
ipcMain.on("getAllPasswords",tryCatch(async (event:IpcMainEvent)=>{
        const data = await getAllPasswords();
        event.reply("gotAllPasswords",data)
    })
)
ipcMain.on("getPasswords",tryCatch(async (event: IpcMainEvent, id: number) => {
        const password = await getPassword(id);
        if(!password){
            return sendMsg("Password Not Found")
        }
        event.reply("gotPassword", password);
    })
);

ipcMain.on("createPassword",tryCatch(async (event: IpcMainEvent, password:IPassword) => {
        const newPass = await createPassword(password);
        sendMsg("Password Created Successfully", false);
        event.reply("createdPassword", newPass);
    })
);

ipcMain.on("updatePassword",tryCatch(async (event: IpcMainEvent, id: number, newPass: IPassword) => {
        const updated = await updatePassword(id, newPass);
        event.reply("updatedPassword", updated);
    })
);

ipcMain.on("deletePassword",tryCatch(async (event: IpcMainEvent, id:number) => {
        const deleted = await deletePassword(id);
        sendMsg("Password Deleted",false);
        event.reply("deletedPassword", id);
    })
);
app.whenReady().then(async () => {
    try {
        db = await connectDB();
        const exists = await db.hasModel("Password");
        if (!exists) {
            await createModel(db);
        }
        passwordModel = await db.getModel("Password");
        userModel = await db.getModel("User");
        noteModel = await db.getModel("Note");
        cardModel = await db.getModel("Credit");
    } catch (error) {
        console.log(error);
    }
    createWindow();
});

app.on("window-all-closed", async () => {
    await db.close();
    if (process.platform !== "darwin") app.quit();
});
