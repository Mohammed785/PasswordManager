const dataSection = document.querySelector('.data-section');
const dataListSection = document.querySelector('.data-list-section');
const sections = document.querySelectorAll('.section');

let inputs;
let btns;
let closeBtn;
let createBtn;
let items;
let currentView = null;
let current = null;

const queryDocument = (selectedItem=false)=>{
    inputs = document.querySelectorAll('.input')
    if(selectedItem){
        setTimeout(addEventToBtns,100);
    }else{
        createBtn = document.getElementById("create")
        createBtn.addEventListener("click",e=>{
            if (currentView === "password") {
                const data = getInput(true)
                const validated = validate(data,true);
                if(!validated)return window.utils.showMsg("Please Check Your Input!!! And Try Again",true)
                window.password.createPassword(data);
            } else if (currentView === "note") {
                const data = getInput(false,note = true,false);
                window.note.createNote(data);
            } else if (currentView === "credit") {
                const data = getInput(false,false,credit = true);
                window.credit.createCredit(data);
            }
            setTimeout(queryItems,100)
            document.querySelector(".not-found").remove()
        })
    }
}
const queryItems = ()=>{
    items = document.querySelectorAll(".item");
    items.forEach((item) => {
        item.addEventListener("click", (e) => {
            if (currentView === "password")window.password.getPassword(e.target.id);
            else if (currentView === "note") window.note.getNote(e.target.id);
            else if (currentView === "credit")window.credit.getCard(e.target.id);
            queryDocument(true)
        });
    });
}
const validate = (obj,create=false)=>{
    for (const [prop, value] of Object.entries(obj)) {
        if (!value) {
            if (create) return false;
        }
    }
    return true
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
    btns = document.querySelectorAll(".btn");
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const btnId = e.target.id;
            if (btnId === "delete") {
                const id = e.target.dataset.id;
                if (currentView === "password") {
                    window.password.deletePassword(id);
                    dataSection.innerHTML = window.password.getTemplate();
                    queryDocument()
                } else if (currentView === "note") {
                    window.note.deleteNote(id);
                } else if (currentView === "credit") {
                    window.credit.deleteCard(id);
                }
            } else if (btnId === "update") {
                const id = e.target.dataset.id;
                if (currentView === "password") {
                    const newData = getInput((password = true));
                    window.password.updatePassword(id, newData);
                } else if (currentView === "note") {
                    const newData = getInput((note = true));
                    window.note.updateNote(id, newData);
                } else if (currentView === "credit") {
                    const newData = getInput((credit = true));
                    window.credit.updateCard(id, newData);
                }
            }
        });
    });
    setTimeout(()=>{
        closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click",e=>{
            if (currentView === "password") {
                dataSection.innerHTML = window.password.getTemplate();
            } else if (currentView === "note") {
                dataSection.innerHTML = window.note.getTemplate();
            } else if (currentView === "bank") {
                dataSection.innerHTML = window.bank.getTemplate();
            }
        })
    },100) 
}

sections.forEach(section=>{
    section.addEventListener("click",e=>{
        const ID=e.target.id;
        if(ID==="passwords"){
            currentView = 'password';
            window.password.getAll();
            dataSection.innerHTML = window.password.getTemplate();
        }
        else if(ID==='notes'){
            currentView = 'note';
            data = window.credit.getAll();
            dataSection.innerHTML = window.note.getTemplate();
        }
        else if(ID==='bank'){
            currentView = 'bank';
            data = window.note.getAll();
            dataSection.innerHTML = window.credit.getTemplate();
        }
        queryDocument()
        setTimeout(queryItems,100)
    })
})
