export function initSidebar() {
    // 1. Selección de elementos
    const sidebarBtnTema = document.querySelector('#tema');
    const sidebarBtnFav = document.querySelector("#favoritos");
    const favoritosDiv = document.querySelector("#favoritosDiv");
    const btnClosed = document.querySelector("#closed");

    if (sidebarBtnTema) {
        sidebarBtnTema.setAttribute('data-tooltip', 'Cambiar Tema');
    }
    
    if (sidebarBtnFav) {
        sidebarBtnFav.setAttribute('data-tooltip', 'Mis Favoritos');
    }

    sidebarBtnTema?.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', 'dark');
        }
    });

    sidebarBtnFav?.addEventListener("click", () => {
        favoritosDiv?.classList.toggle("favoritos-overlay-open");
    });

    btnClosed?.addEventListener("click", () => {
        favoritosDiv?.classList.remove("favoritos-overlay-open");
    });
}