const dataSection = document.querySelector('.data-section');
const dataListSection = document.querySelector('.data-list-section');
const sections = document.querySelectorAll('.section');

let inputs;
let btns;
let closeBtn;
let createBtn;
let copyBtns;
let items;
let updating = false;
let currentView = null;

// query
const queryDocument = (selectedItem=false)=>{
    if(selectedItem){
        setTimeout(addEventToBtns,100);
        setTimeout(setInputValues,100)
        setTimeout(changeInputState, 100);
        updating = false
    }else{
        inputs = document.querySelectorAll('.input')
        createBtn = document.getElementById("create")
        createBtn.addEventListener("click",e=>{
            if (currentView === "password") {
                const data = getInput(true)
                const validated = validateInput(data,true);
                if(!validated)return window.utils.showMsg("Please Check Your Input!!! And Try Again",true)
                window.password.createPassword(data);
            } else if (currentView === "note") {
                const data = getInput(false,note = true,false);
                const validated = validateInput(data,true)
                if(!validated)return window.utils.showMsg("Please Check Your Input!!! And Try Again",true)
                window.note.createNote(data);
            } else if (currentView === "credit") {
                const data = getInput(false,false,credit = true);
                const validated = validateInput(data,true)
                if(!validated)return window.utils.showMsg("Please Check Your Input!!! And Try Again",true)
                window.credit.createCard(data);
            }
            setTimeout(queryItems,100)
            const notFoundMsg = document.querySelector(".not-found")
            if(notFoundMsg)notFoundMsg.remove()
            setInputValues(true)
        })
    }
}

const queryItems = () => {
    items = document.querySelectorAll(".item");
    items.forEach((item) => {
        item.addEventListener("click", (e) => {
            const itemId = item.id;
            if (currentView === "password") window.password.getPassword(itemId);
            else if (currentView === "note") window.note.getNote(itemId);
            else if (currentView === "credit") window.credit.getCard(itemId);
            queryDocument(true);
        });
    });
};


const showUpdatedData = (password,credit,note) => {
    const currentItem = window.utils.getCurrent();
    const listItemData = document.getElementById(currentItem.id);
    const img = document.querySelector(".data-img");
    if(note){
        listItemData.children[1].children[0].innerText = `${currentItem.title.slice(0,13)}...`
        listItemData.children[1].children[1].innerText = `${currentItem.note.slice(0, 15)}...`;
    }else if(password){
        listItemData.children[1].children[0].innerText = `${currentItem.username.slice(0,13)}...`
        img.src = `../images/${currentItem.platform}.png`;
        listItemData.children[0].src = `../images/${currentItem.platform}.png`;
    } else if(credit){
        const name = currentItem.name
        listItemData.children[1].children[0].innerText = `${name.length > 13 ? `${name.slice(0, 13)}...` : name}`
        img.src = `../images/${currentItem.company}.png`;
        listItemData.children[0].src = `../images/${currentItem.company}.png`;
    }
}

// input
const setInputValues = (reset=false) => {
    const currentItem = window.utils.getCurrent();
    inputs = document.querySelectorAll(".input");
    if(reset){
        inputs.forEach((inp) => {
            if(inp.id!=="platform"&&inp.id!=="company") inp.value = "";
        });
        return
    }
    if(currentItem){
        for(const [prop,value] of Object.entries(currentItem)){
            inputs.forEach(inp=>{
                if(inp.id===prop){
                    inp.value = value
                }
            })
        }
    }
}


const validateInput = (obj, create = false) => {
    if(!Object.entries(obj).length){
        return false
    }
    for (const [prop, value] of Object.entries(obj)) {
        if (!value) {
            if (create) return false;
        }
    }
    return true;
};

const getInput = (password = false, note = false, credit = false) => {
    const data = {};
    if (password) {
        inputs.forEach((input) => {
            if (input.id === "password") data.password = input.value;
            else if (input.id === "username") data.username = input.value;
            else if (input.id === "platform") data.platform = input.value;
        });
    } else if (note) {
        inputs.forEach((input) => {
            if (input.id === "title") data.title = input.value;
            else if (input.id === "note") data.note = input.value;
        });
    } else if (credit) {
        inputs.forEach((input) => {
            if (input.id === "company") data.company = input.value;
            else if (input.id === "cardNumber") data.cardNumber = input.value;
            else if (input.id === "expYear") data.expYear = input.value;
            else if (input.id === "expMonth") data.expMonth = input.value;
            else if (input.id === "cvv") data.cvv = input.value;
            else if (input.id === "name") data.name = input.value;
        });
    }
    return data;
};

const changeInputState = (add=true) => {
    inputs.forEach(inp=>{
        if (add) {
            inp.readOnly = true
        } else {
            inp.readOnly = false
        }
    })
}

// eventListener
const addEventToBtns = ()=>{
    btns = document.querySelectorAll(".btn");
    copyBtns = document.querySelectorAll(".copy");
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const btnId = e.target.id;
            if (btnId === "delete") {
                const id = e.target.dataset.id;
                if (currentView === "password") {
                    window.password.deletePassword(id);
                    dataSection.innerHTML = window.password.getTemplate();
                } else if (currentView === "note") {
                    window.note.deleteNote(id);
                    dataSection.innerHTML = window.note.getTemplate();
                } else if (currentView === "credit") {
                    window.credit.deleteCard(id);
                    dataSection.innerHTML = window.credit.getTemplate();
                }
                queryDocument();
            } else if (btnId === "update") {
                const id = e.target.dataset.id;
                if (currentView === "password") {
                    if(updating) {
                        const newData = getInput(password = true);
                        window.password.updatePassword(id, newData);
                        setTimeout(()=>showUpdatedData(true,false,false),200)
                        updating = false
                        changeInputState()
                    }
                } else if (currentView === "note") {
                    if(updating) {
                        const newData = getInput(false, note = true, false);
                        window.note.updateNote(id, newData);
                        setTimeout(()=>showUpdatedData(false,false,true),200)
                        updating = false
                        changeInputState()
                    }
                } else if (currentView === "credit") {
                    if(updating) {
                        const newData = getInput(false, false, credit=true);
                        window.credit.updateCard(id, newData);
                        setTimeout(()=>showUpdatedData(false,true,false),200)
                        updating = false
                        changeInputState()
                    }
                }
                if(!updating){
                    changeInputState(false);
                    updating = true
                    window.utils.showMsg("Enter The New Values", false);
                }
            }
        });
    });
    copyBtns.forEach(btn=>{
        btn.addEventListener("click",e=>{
            const inp = btn.previousSibling.previousSibling;
            const id = btn.previousElementSibling.id
            if(id==="password"||id==="cvv"||id==="cardNumber"){
                window.password.copyPassword(inp.value)
            } else {
                navigator.clipboard.writeText(inp.value);
            }
        })
    })
    setTimeout(()=>{
        closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click",e=>{
            if (currentView === "password") {
                dataSection.innerHTML = window.password.getTemplate();
            } else if (currentView === "note") {
                dataSection.innerHTML = window.note.getTemplate();
            } else if (currentView === "bank") {
                dataSection.innerHTML = window.credit.getTemplate();
            }
            queryDocument()
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
            window.note.getAll();
            dataSection.innerHTML = window.note.getTemplate();
        }
        else if(ID==='bank'){
            currentView = "credit";
            window.credit.getAll();
            dataSection.innerHTML = window.credit.getTemplate();
        }
        queryDocument()
        setTimeout(queryItems,100)
    })
})
