import { IpcMainEvent,BrowserWindow } from "electron";

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
    const window = BrowserWindow.getFocusedWindow()
    if(isError)window?.webContents.send("error",msg)
    else window?.webContents.send("success",msg)
}