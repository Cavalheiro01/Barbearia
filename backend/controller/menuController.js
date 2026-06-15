const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
        menu.classList.toggle("ativo");
        btnMenu.classList.toggle("ativo");
    });
}