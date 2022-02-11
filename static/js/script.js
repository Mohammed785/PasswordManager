const dataSection = document.querySelector('.data-section');
const sections = document.querySelectorAll('.section');
let inputs;
let btns;
let closeBtn;
let createBtn;

let currentView = null;
let current = null;

const queryDocument = (selectItem=true)=>{
    if(selectItem){
        inputs = document.querySelectorAll('.input')
        closeBtn = document.querySelector(".close");
        btns = document.querySelectorAll(".btn");
        addEventToBtns();
    }else{
        createBtn = document.getElementById("create")
        createBtn.addEventListener("click",e=>{
            if (currentView === "password") {
                const data = getInput((password = true));
                window.password.create(data);
            } else if (currentView === "note") {
                const data = getInput((note = true));
                window.note.create(data);
            } else if (currentView === "credit") {
                const data = getInput((credit = true));
                window.credit.create(data);
            }
        })
    }
}

const getInput = (password=false,note=false,credit=false)=>{
    const data = {};
    if(password){
        inputs.forEach((input) => {
            if(input.id==='password') data.password = input.value
            else if(input.id==='username') data.username = input.value
            else if(input.id==='platform') data.platform = input.value
        })
    }else if(note){
        inputs.forEach((input) => {
            if (input.id === "title") data.title = input.value;
            else if (input.id === "note") data.note = input.value;
        });
    }else if(credit){
        inputs.forEach((input) => {
            if (input.id === "company") data.company = input.value;
            else if (input.id === "cardNumber") data.cardNumber = input.value;
            else if (input.id === "expDate") data.expDate = input.value;
            else if(input.id === "cvv") data.cvv = input.value
        });
    }
    return data;
}
const addEventToBtns = ()=>{
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.id;
            if(id==='delete'){
                const id = e.target.dataset.id
                if (currentView === "password") {
                    window.password.deletePassword(id);
                } else if (currentView === "note") {
                    window.note.deleteNote(id);
                } else if (currentView === "credit") {
                    window.credit.deleteCard(id);
                }
            }else if(id==="update"){
                const id = e.target.dataset.id;
                if (currentView === "password") {
                    const newData = getInput(password=true)
                    window.password.updatePassword(id,newData);
                } else if (currentView === "note") {
                    const newData = getInput(note = true);
                    window.note.updateNote(id,newData);
                } else if (currentView === "credit") {
                    const newData = getInput(credit = true);
                    window.credit.updateCard(id,newData);
                }
            }
        });
    });
    closeBtn.addEventListener("click",e=>{
        if (currentView === "password") {
            dataSection.innerHTML = passwordMain;
        } else if (currentView === "note") {
            dataSection.innerHTML = noteMain;
        } else if (currentView === "bank") {
            dataSection.innerHTML = bankMain;
        }
    })
}

sections.forEach(section=>{
    section.addEventListener("click",e=>{
        const name=e.target.name;
        if(name==="passwords"){
            currentView = 'password'
            dataSection.innerHTML = passwordMain;
        }
        else if(name==='notes'){
            currentView = 'note'
            dataSection.innerHTML = noteMain;
        }
        else if(name==='bank'){
            currentView = 'bank'
            dataSection.innerHTML = bankMain;
        }
    })
})

//UI
const colors = document.querySelectorAll(".color");
const toggleBtn = document.getElementsByTagName("svg")[0];
toggleBtn.addEventListener("click",(e)=>{
    document.body.classList.toggle("light-mode")
})
colors.forEach((color) => {
    color.addEventListener("click", (e) => {
        const theme = color.getAttribute("data-color");
        console.log(theme);
        document.body.setAttribute("data-theme", theme);
    });
});

// main page html template
const passwordMain = `<div class="input-section">
                <select name="platform" id="platform" class="input" required>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Apple">Apple</option>
                    <option value="Github">Github</option>
                    <option value="StackOverflow">StackOverflow</option>
                    <option value="Slack">Slack</option>
                    <option value="Discord">Discord</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Disney+">Disney+</option>
                    <option value="HBO">HBO</option>
                </select>
                <input type="text" class="input" placeholder="Username or Email" name="username" id="username" required>
                <input type="password" class="input" placeholder="Password" name="password" id="password" required>
            </div>
            <div class="btn-section">
                <button class="btn" id="create">Create</button>
            </div>`;
const bankMain = `<div class="input-section">
                <select name="company" id="compeny" class="input" required>
                    <option value="MasterCard">MasterCard</option>
                    <option value="Visa">Visa</option>
                    <option value="AmericanExpress">AmericanExpress</option>
                </select>
                <input type="text" class="input" placeholder="Card Number" name="cardNumber" id="cardNumber" required>
                <input type="date" class="input" placeholder="Expire Date" name="expDate" id="expDate" required>
                <input type="text" class="input" placeholder="CVV" name="cvv" id="cvv"  maxlength="3" required>
            </div>
            <div class="btn-section">
                <button class="btn" id="create">Create</button>
            </div>`;
const noteMain = `<div class="input-section">
                <input type="text" class="input" placeholder="Title for the note" name="title" id="noteTitle" required>
                <textarea name="note" id="noteBody" placeholder="Note" cols="30" rows="10"></textarea>
            </div>
            <div class="btn-section">
                <button class="btn" id="create">Create</button>
            </div>`;