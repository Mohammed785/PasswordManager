import { app, BrowserWindow, ipcMain, IpcMainEvent,dialog } from "electron";
import { LooseObject, Model, Trilogy } from "trilogy";
import { connectDB, createModel, getPassword, createPassword, updatePassword, deletePassword } from "./db";
import { join } from "path";

let passwordModel: Model<LooseObject>;
let db: Trilogy;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 900,
        center: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            nodeIntegration: true,
            safeDialogs: true,
        },
    });
    win.loadFile(join(__dirname, "..", "static", "html", "main.html"));
};

const tryCatch = (fn: Function) => {
    return async (event: IpcMainEvent, ...args: any[]) => {
        try {
            await fn(event, ...args);
        } catch (error) {
            event.reply("Error", error);
        }
    };
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
    } catch (error) {
        console.log(error);
    }
    createWindow();
});

app.on("window-all-closed", async () => {
    await db.close();
    if (process.platform !== "darwin") app.quit();
});
