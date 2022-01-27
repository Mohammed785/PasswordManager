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

export const sendError = (error:string,level:number) => {
    ipcMain.emit("Error",error,level)
}
export const sendNotification = (body:string) => {
    ipcMain.emit("Notification",body)
}