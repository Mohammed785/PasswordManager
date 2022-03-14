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

