const submitBtn = document.getElementById("submit");
const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");
const helpBtns = document.querySelectorAll(".help-btn");

submitBtn.addEventListener("click", (e) => {
    const username = usernameInp.value;
    const password = passwordInp.value;
    if (!username || !password) {
        window.utils.showMsg("Please Enter Both Username And Password");
        return;
    }
    if (e.target.name === "login") {
        window.auth.login(username, password);
    } else {
        window.auth.register(username, password);
    }
});

helpBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const name = e.target.name;
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
