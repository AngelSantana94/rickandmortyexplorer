import { createUniversalList } from "./renderContainerFullScreen";
export async function renderBoard(data, endPoint) {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  for (let element of data.results) {
    //Container Elemento
    const containerElement = document.createElement("div");
    containerElement.className = "container-element";

    //Container con toda la info de element
    const containerInfoElement = document.createElement("div");
    containerInfoElement.className = "container-info-element";

    //Nombre del elemento
    const infoName = document.createElement("h3");
    infoName.className = "info-name";
    infoName.textContent = element.name;
    containerInfoElement.appendChild(infoName);

    if (endPoint === "character") {
      //Div de la imagen para character
      const divImgCharacter = document.createElement("div");
      divImgCharacter.className = "div-img-character";
      containerElement.appendChild(divImgCharacter);
      //Imagen de character
      const imgCharacter = document.createElement("img");
      imgCharacter.className = "img-character";
      imgCharacter.src = element.image;
      divImgCharacter.appendChild(imgCharacter);
      //Estado del character
      const infoStatus = document.createElement("p");
      infoStatus.className = "info-status";
      infoStatus.textContent = `Status: ${element.status}`;
      containerInfoElement.appendChild(infoStatus);
      containerInfoElement.classList.add(
        `status-${element.status.toLowerCase()}`,
      );
      //Especie del character
      const infoSpecies = document.createElement("p");
      infoSpecies.className = "info-species";
      infoSpecies.textContent = `Species: ${element.species}`;
      containerInfoElement.appendChild(infoSpecies);
      //Origen del character
      const infoOrigins = document.createElement("p");
      infoOrigins.className = "info-origins";
      infoOrigins.textContent = `Origin: ${element.origin.name}`;
      containerInfoElement.appendChild(infoOrigins);
      //Location del character
      const infoLocation = document.createElement("p");
      infoLocation.className = "info-location";
      infoLocation.textContent = `Location: ${element.location.name}`;
      containerInfoElement.appendChild(infoLocation);
    }

    if (endPoint === "location") {
      //Tipo de elemento
      const infoType = document.createElement("p");
      infoType.className = "info-type";
      infoType.textContent = `Type: ${element.type}`;
      containerInfoElement.appendChild(infoType);
      //Dimension donde se encuentra el elemento
      const infoDimension = document.createElement("p");
      infoDimension.className = "info-dimension";
      infoDimension.textContent = `Dimension: ${element.dimension}`;
      containerInfoElement.appendChild(infoDimension);
      //Residentes del elemento
      const infoResidents = document.createElement("p");
      infoResidents.className = "info-residents";
    }

    if (endPoint === "episode") {
      //Episodio
      const infoEpisode = document.createElement("p");
      infoEpisode.className = "info-episode";
      infoEpisode.textContent = `Episode: ${element.episode}`;
      containerInfoElement.appendChild(infoEpisode);
      //Fecha de lanzamiento
      const infoAirdate = document.createElement("p");
      infoAirdate.className = "air-date";
      infoAirdate.textContent = `Air date: ${element.air_date}`;
      containerInfoElement.appendChild(infoAirdate);
    }

    //FullScreenOverlay
    const fullScreenOverlay = document.createElement("div");
    fullScreenOverlay.className = "fullscreen-overlay";
    fullScreenOverlay.style.display = "none";
    //ModalContect
    const modalContect = document.createElement("div");
    modalContect.className = "modal-content";
    //Cerrar
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";

    const imgCloseBtn = document.createElement("img");
    imgCloseBtn.className = "img-close-btn";
    imgCloseBtn.src = "img/close.svg";

    closeBtn.appendChild(imgCloseBtn);

    fullScreenOverlay.appendChild(modalContect);

    closeBtn.addEventListener("click", () => {
      fullScreenOverlay.style.display = "none";
    });

    containerElement.appendChild(containerInfoElement);
    app.appendChild(fullScreenOverlay);

    app.appendChild(containerElement);

    containerElement.addEventListener("click", async () => {
      // 1. Preparar el modal (Limpiar contenido anterior)
      let modalBody = fullScreenOverlay.querySelector(".modal-content");
      if (!modalBody) {
        modalBody = document.createElement("div");
        modalBody.className = "modal-content";
        fullScreenOverlay.appendChild(modalBody);
      }
      modalBody.innerHTML = "";

      // 2. CREAR LA CABECERA (Header)
      const header = document.createElement("div");
      header.className = "modal-header";

      // Si tiene imagen (Personajes), la ponemos
      if (element.image) {
        const headerImg = document.createElement("img");
        headerImg.className = "modal-img-header";
        headerImg.src = element.image;
        header.appendChild(headerImg);
      }

      const infoText = document.createElement("div");
      infoText.className = "modal-info-text";

      // Título universal (Nombre)
      const h2 = document.createElement("h2");
      h2.textContent = element.name;
      infoText.appendChild(h2);

      // Info dinámica según el tipo
      if (endPoint === "character") {
        infoText.innerHTML += `
                <p><span class="status-tag">Status: ${element.status}</span></p>
                <p><strong>Species:</strong> ${element.species}</p>
                <p><strong>Origin:</strong> ${element.origin.name}</p>
                <p><strong>Last Location:</strong> ${element.location.name}</p>
            `;
      } else if (endPoint === "location") {
        infoText.innerHTML += `
                <p><strong>Type:</strong> ${element.type}</p>
                <p><strong>Dimension:</strong> ${element.dimension}</p>
            `;
      } else if (endPoint === "episode") {
        infoText.innerHTML += `
                <p><strong>Episode Code:</strong> ${element.episode}</p>
                <p><strong>Air Date:</strong> ${element.air_date}</p>
            `;
      }

      header.appendChild(infoText);

      header.appendChild(closeBtn);
      modalBody.appendChild(header);

      // 3. LLAMADAS A LA API Y LISTADOS (Parte inferior)
      console.log("Cargando lista de detalles...");

      if (endPoint === "character") {
        const ids = element.episode.map((url) => url.split("/").pop());
        const res = await fetch(
          `https://rickandmortyapi.com/api/episode/${ids.join(",")}`,
        );
        const data = await res.json();
        modalBody.appendChild(createUniversalList(data, "episode"));
      } else if (endPoint === "location") {
        const ids = element.residents.map((url) => url.split("/").pop());
        if (ids.length > 0) {
          const res = await fetch(
            `https://rickandmortyapi.com/api/character/${ids.join(",")}`,
          );
          const data = await res.json();
          modalBody.appendChild(createUniversalList(data, "character"));
        }
      } else if (endPoint === "episode") {
        const ids = element.characters.map((url) => url.split("/").pop());
        if (ids.length > 0) {
          const res = await fetch(
            `https://rickandmortyapi.com/api/character/${ids.join(",")}`,
          );
          const data = await res.json();
          modalBody.appendChild(createUniversalList(data, "character"));
        }
      }

      fullScreenOverlay.style.display = "flex";
    });
  }
}
