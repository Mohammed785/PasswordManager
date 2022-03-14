import { IpcMainEvent, BrowserWindow } from "electron";

export const tryCatch = (fn: Function) => {
    return async (event: IpcMainEvent, ...args: any[]) => {
        try {
            await fn(event, ...args);
        } catch (error) {
            console.error(error);
            sendMsg(error as string);
        }
    };
};

export const sendMsg = (msg: string, isError = true) => {
    const window = BrowserWindow.getFocusedWindow();
    if (isError) window?.webContents.send("error", msg);
    else window?.webContents.send("success", msg);
};

export const showMsg = (msg: string, isError = true) => {
    const errorArea = document.querySelector(".errors") as HTMLDivElement;
    errorArea.innerHTML += `<div class="error-msg ${isError ? "error" : "success"} fade-msg">
            <span class="error-close">&times;</span>${msg}</div>`;
    const close = document.querySelectorAll(".error-close");
    close.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            errorArea.removeChild(
                (e.target as HTMLButtonElement).parentElement!
            );
        });
    });
    setTimeout(() => {
        if (errorArea.children.length != 0) {
            const firstChild = errorArea.children[0];
            if (firstChild) errorArea.removeChild(firstChild);
        }
    }, 2000);
};
