export function createCatCard(element, isFavoriteView = false, favBtnOriginal = null) {
    const breedName = element.breeds?.[0]?.name || "Common Cat";
    const breedDesc = element.breeds?.[0]?.description || "No description";

    const cardDiv = document.createElement("div");
    cardDiv.className = "cat-card";

    const catImg = document.createElement("img");
    catImg.src = element.url;
    catImg.className = "cat-card__img";

    const overlay = document.createElement("div");
    overlay.className = "card-overlay";

    const actionWrapper = document.createElement("span");
    actionWrapper.className = "card-overlay__tooltip-wrapper";
    const actionIcon = document.createElement("img");

    if (isFavoriteView) {
        actionWrapper.setAttribute('data-tooltip', 'Remove from favorites');
        actionIcon.src = "/src/img/delete.svg";
        actionIcon.className = "card-overlay__icon-delete";
        
        actionIcon.onclick = () => {
            deleteFav(element.id, cardDiv, favBtnOriginal);
        };
    } else {
        actionWrapper.setAttribute('data-tooltip', 'Add to favorites');
        actionIcon.src = "/src/img/favorito.svg";
        actionIcon.className = "card-overlay__icon-fav";
    }
    actionWrapper.appendChild(actionIcon);

    const infoWrapper = document.createElement("span");
    infoWrapper.className = "card-overlay__tooltip-wrapper";
    infoWrapper.setAttribute('data-tooltip', `Breed: ${breedName}\n---\n${breedDesc}`);
    const infoIcon = document.createElement("img");
    infoIcon.src = "/src/img/cat.svg";
    infoIcon.className = "card-overlay__icon-breed";
    infoWrapper.appendChild(infoIcon);

    overlay.appendChild(actionWrapper);
    overlay.appendChild(infoWrapper);

    if (isFavoriteView) {
        const cleanId = element.id.replace('#', '');
        cardDiv.id = `${cleanId}`;
        
        const fullScreenWrapper = document.createElement("span");
        fullScreenWrapper.className = "card-overlay__tooltip-wrapper";
        fullScreenWrapper.setAttribute('data-tooltip', 'Full Screen');
        
        const fullIcon = document.createElement("img");
        fullIcon.src = "/src/img/fullscreen.svg";
        fullIcon.className = "card-overlay__icon-fullscreen";
        
        fullIcon.onclick = () => {
            openFullScreen(element.url);
        };
        
        fullScreenWrapper.appendChild(fullIcon);
        overlay.appendChild(fullScreenWrapper);
    }

    cardDiv.appendChild(catImg);
    cardDiv.appendChild(overlay);

    return cardDiv;
}
export function openFullScreen(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

export function deleteFav(id, divABorrar, favBtnOriginal) {
    if (divABorrar) {
        divABorrar.remove();
    }

    if (favBtnOriginal) {
        favBtnOriginal.classList.remove('active');
    }

    let dataActual = JSON.parse(localStorage.getItem("cat-card")) || [];
    let dataFiltrada = dataActual.filter(gato => gato.id !== id);
    localStorage.setItem("cat-card", JSON.stringify(dataFiltrada));
    
    console.log(`Gato ${id} eliminado correctamente.`);
}
