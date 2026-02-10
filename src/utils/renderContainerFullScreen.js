/**
 * Generador Universal de Listados (Personajes, Episodios o Ubicaciones)
 * @param {Array|Object} data - Datos de la API
 * @param {String} type - "character", "episode" o "location"
 * @returns {HTMLElement} - Div con título y lista renderizada
 */
export function createUniversalList(data, type) {
    // 1. Normalizar datos (convertir objeto único en array si hace falta)
    const items = Array.isArray(data) ? data : [data];
    
    // 2. Crear contenedor principal
    const wrapper = document.createElement("div");
    wrapper.className = "universal-list-wrapper";

    // 3. AGREGAR EL H3 DINÁMICO (Lo que pediste)
    const listTitle = document.createElement("h3");
    listTitle.className = "list-section-title";
    
    // El título depende de lo que estamos MOSTRANDO en las cards
    if (type === "character") listTitle.textContent = "Characters:";
    else if (type === "episode") listTitle.textContent = "Episodes:";
    else if (type === "location") listTitle.textContent = "Locations:";
    
    wrapper.appendChild(listTitle);

    // 4. Crear el contenedor de las cards
    const listContainer = document.createElement("div");
    listContainer.className = `universal-list-container list-${type}`;

    for (const item of items) {
        const card = document.createElement("div");
        card.className = "mini-card";

        if (type === "character") {
            const img = document.createElement("img");
            img.src = item.image;
            img.className = "mini-img";

            const name = document.createElement("strong"); 
            name.textContent = item.name;

            const status = document.createElement("p");
            status.textContent = `Status: ${item.status}`;

            card.append(img, name, status);
        } 
        else if (type === "episode") {
            const title = document.createElement("h4");
            title.className = "fullscreen-episode-name";
            title.textContent = item.name;

            const code = document.createElement("p");
            code.className = "fullscreen-episode-number";
            code.textContent = `Code: ${item.episode}`;

            card.append(title, code);
        }
        else if (type === "location") {
            const locName = document.createElement("h4");
            locName.textContent = item.name;

            const locType = document.createElement("p");
            locType.textContent = `Type: ${item.type}`;

            const dimension = document.createElement("p");
            dimension.textContent = `Dim: ${item.dimension}`;

            card.append(locName, locType, dimension);
        }

        listContainer.appendChild(card);
    }

    wrapper.appendChild(listContainer);
    return wrapper;
}