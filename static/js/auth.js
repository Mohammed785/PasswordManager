const submitBtn = document.getElementById('submit');
const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");
const errorArea = document.querySelector('.errors');
const container = document.querySelector('.container');
const helpBtns = document.querySelectorAll(".help-btn");


submitBtn.addEventListener("click",(e)=>{
    const username = usernameInp.value;
    const password = passwordInp.value;
    if(!username || !password){
        showError("Please Enter Both Username And Password")
        return;
    }
    if(e.target.name==='login'){
        window.auth.login(username,password)
    }else{
        if (password.length < 8) {
            showError("Min Password Length Is 8 Characters");
            return;
        }
        window.auth.register(username, password);
    }
})

const showError = (msg,type='error')=>{
    errorArea.innerHTML += `
    <div class="error-msg ${type.toLowerCase()}">
            <span class="close">&times;</span>
            ${msg}
    </div>
    `;
    while(errorArea.offsetHeight+40>container.offsetTop){
        errorArea.removeChild(errorArea.children[0]);
    }
    const close = document.querySelectorAll('.close');
    close.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            errorArea.removeChild(e.target.parentElement);
        })
    })
}

helpBtns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        const name = e.target.name;
        if(name==='forget'){
            //TODO:
        }else if(name==='need-acc'){
            window.auth.needAccount();
        }else if(name==='have-acc'){
            window.api.haveAccount();
        }else{
            window.api.forgetPass()
        }
    })
})