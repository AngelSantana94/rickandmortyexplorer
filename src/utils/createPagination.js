export const createPagination = (totalPages, currentPage, onPageChange) => {
    const container = document.querySelector(".paginacion-container");
    if (!container) return;

    container.innerHTML = "";

    const range = 2; 
    const buttons = [];

    buttons.push(1);

    if (currentPage > range + 2) {
        buttons.push("...");
    }

    let start = Math.max(2, currentPage - range);
    let end = Math.min(totalPages - 1, currentPage + range);

    for (let i = start; i <= end; i++) {
        buttons.push(i);
    }

    if (currentPage < totalPages - (range + 1)) {
        buttons.push("...");
    }
    if (totalPages > 1) {
        buttons.push(totalPages);
    }

    buttons.forEach(btn => {
        const span = document.createElement("span");
        span.textContent = btn;
        span.className = btn === currentPage ? "page-btn active" : "page-btn";
        
        if (btn === "...") {
            span.classList.add("ellipsis");
        } else {
            span.addEventListener("click", () => {
                onPageChange(btn); 
            });
        }
        
        container.appendChild(span);
    });
};