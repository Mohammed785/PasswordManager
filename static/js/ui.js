//UI
const errorArea = document.querySelector(".errors");
const colors = document.querySelectorAll(".color");
const toggleBtn = document.getElementsByTagName("svg")[0];

toggleBtn.addEventListener("click", (e) => {
    document.body.classList.toggle("light-mode");
});
colors.forEach((color) => {
    color.addEventListener("click", (e) => {
        const theme = color.getAttribute("data-color");
        document.body.setAttribute("data-theme", theme);
    });
});

const clearMsg = setInterval(() => {
    let first = true;
    if (errorArea.children.length != 0) {
        const firstChild = errorArea.children[0];
        if (firstChild) errorArea.removeChild(firstChild);
    }
    if (!first && errorArea.children.length === 0) {
        clearInterval(clearMsg);
    }
}, 2300);
