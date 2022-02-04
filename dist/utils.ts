import { ipcMain, IpcMainEvent } from "electron";

export const tryCatch = (fn: Function) => {
    return async (event: IpcMainEvent, ...args: any[]) => {
        try {
            await fn(event, ...args);
        } catch (error) {
            event.reply("Error", error);
        }
    };
};

export const sendMsg = (msg:string,isError=true) => {
    console.error(msg);
    if(isError)ipcMain.emit("Error",msg)
    else ipcMain.emit("success",msg)
}