import { app, BrowserWindow, ipcMain, IpcMainEvent, dialog } from "electron";
import { connectDB, createModel, getPassword, createPassword, updatePassword, deletePassword } from "./db";
import { login, register } from "./auth/auth";
import { LooseObject, Model, Trilogy } from "trilogy";
import { sendMsg, tryCatch } from "./utils";
import { join } from "path";

let passwordModel: Model<LooseObject>;
let userModel: Model<LooseObject>;
let currentUser: LooseObject|undefined;
export let db: Trilogy;

const createWindow = () => {
    const mainWin = new BrowserWindow({
        width: 1100,
        height: 900,
        center: true,
        show:false,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
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
            preload: join(__dirname, "auth", "authPreload.js"),
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
                const data = await deletePassword(passwordModel,arg);
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

ipcMain.on("login",async (event,username,password)=>{
    const user = await login(userModel,username,password)
    if(user){
        BrowserWindow.getAllWindows()[0].hide()
        BrowserWindow.getAllWindows()[1].show()
        currentUser = user;
    }
})

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
    }
})

ipcMain.on("getPasswords",tryCatch(async (event: IpcMainEvent, arg: any) => {
        const data = await getPassword(passwordModel, arg);
        event.reply("gotPassword", data);
    })
);

ipcMain.on("createPassword",tryCatch(async (event: IpcMainEvent, arg: any) => {
        const newPass = await createPassword(passwordModel, arg);
        event.reply("created", newPass);
    })
);

ipcMain.on("updatePassword",tryCatch(async (event: IpcMainEvent, oldPass: any, newPass: any) => {
        const updated = await updatePassword(passwordModel, oldPass, newPass);
        event.reply("updated", updated);
    })
);

ipcMain.on("deletePassword",tryCatch(async (event: IpcMainEvent, arg: any) => {
        const deleted = await deletePassword(passwordModel, arg);
        event.reply("deleted", deleted);
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
        userModel = await db.getModel("User")
    } catch (error) {
        console.log(error);
    }
    createWindow();
});

app.on("window-all-closed", async () => {
    await db.close();
    if (process.platform !== "darwin") app.quit();
});
