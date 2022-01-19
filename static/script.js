const btns = document.querySelectorAll(".btn");
const inputSection = document.querySelector(".input-section");
const infoArea = document.getElementById("info-area");
const platformInput = document.getElementById("platform");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
let cancelBtn;
let updateReady = false;
let updateSearch;

btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const id = e.target.id;
        if (id === "get") {
            const search = checkInput();
            window.api.getPasswords(search);
        } else if (id === "add") {
            const password = checkInput(true);
            if (!password) return;
            window.api.createPassword(password);
        } else if (id === "update") {
            if (!updateReady) {
                updateSearch = checkInput();
                if(!updateSearch.platform && !updateSearch.username){
                    infoArea.value = "Enter What Password You Want To Change"
                    return;
                }
                if(updateSearch.platform && !updateSearch.username){
                    infoArea.value = "Enter Username For Password You Wan't To Update";
                    return;
                }
                infoArea.value = "Enter New Values";
                inputSection.innerHTML += `<button class="btn" id="cancel">Cancel Update</button>`;
                updateReady = true;
                cancelBtn = document.getElementById("cancel");
                cancelBtn.addEventListener("click",(e)=>{
                    updateReady = false;
                    cancelBtn.parentNode.removeChild(cancelBtn)
                    infoArea.value="Update Canceled"
                });
            } else {
                const newValues = checkInput();
                updateReady = false;
                window.api.updatePassword(updateSearch, newValues);
            }
        } else if (id === "delete") {
            const search = checkInput();
            if(search.platform && !search.username){
                window.api.deletePlatform(search);
            }else{
                window.api.deletePassword(search);
            }
        } else if (id === "clear") {
            infoArea.value = "";
        }
    });
});
const checkInput = (create = false) => {
    let values = {};
    if (create &&(!platformInput.value || !usernameInput.value || !passwordInput.value)) {
        infoArea.value = "Enter All Fields";
        return false;
    }
    platformInput.value ? (values.platform = platformInput.value) : null;
    usernameInput.value ? (values.username = usernameInput.value) : null;
    passwordInput.value ? (values.password = passwordInput.value) : null;
    return values;
};
