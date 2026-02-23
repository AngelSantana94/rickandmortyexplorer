import "./style.css";
import "./sass/main.scss";
import { renderBoard } from "./utils/renderBoard";
import { createPagination } from "./utils/createPagination";

// --- 1. SELECTORES Y ESTADO ---
const header = document.querySelector("#header");
const appBoard = document.querySelector("#app");
const pagination = document.querySelector(".paginacion-container");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#search-form");
const selectEpisodes = document.querySelector("#selectEpisodes");
const selectLocations = document.querySelector("#selectLocations");

let endPoint = "";
let currentPage = 1;
let isFetching = false;
let activeFilters = { episode: "", location: "" };

// --- 2. PETICIONES (LÓGICA CORE) ---

const getInfo = async () => {
  if (isFetching || !endPoint) return;
  isFetching = true;

  try {
    appBoard.innerHTML = "<div class='loader'>Cargando...</div>";
    const response = await fetch(
      `https://rickandmortyapi.com/api/${endPoint}/?page=${currentPage}`,
    );
    const data = await response.json();

    if (data.error) {
      appBoard.innerHTML = `<p class="error">No se encontraron resultados.</p>`;
      pagination.innerHTML = "";
      return;
    }

    appBoard.innerHTML = "";
    renderBoard(data, endPoint);

    pagination.innerHTML = "";
    if (data.info && data.info.pages > 1) {
      createPagination(data.info.pages, currentPage, (newPage) => {
        currentPage = newPage;
        window.scrollTo(0, 0);
        getInfo();
      });
    }
  } catch (error) {
    console.error("Errorazo:", error);
  } finally {
    isFetching = false;
  }
};

const getInfoFromUrl = async (customUrl) => {
  if (isFetching) return;
  isFetching = true;
  try {
    appBoard.innerHTML = "<div class='loader'>Buscando...</div>";
    const response = await fetch(customUrl);
    const data = await response.json();
    appBoard.innerHTML = "";

    const normalizedData = Array.isArray(data) ? { results: data } : data;

    if (normalizedData.error) {
      appBoard.innerHTML = "<p class='error'>No se encontraron resultados.</p>";
    } else {
      renderBoard(normalizedData, endPoint);
    }
    pagination.innerHTML = "";
  } catch (error) {
    console.error("Error en búsqueda externa:", error);
  } finally {
    isFetching = false;
  }
};

async function handleNavigationAndSearch(
  query,
  type,
  currentEndPoint,
  callback,
) {
  if (type === "search") {
    const url = `https://rickandmortyapi.com/api/${currentEndPoint}/?name=${query}`;
    return callback(url);
  }

  if (type === "filter-episode") activeFilters.episode = query;
  if (type === "filter-location") activeFilters.location = query;

  if (activeFilters.episode === "" && activeFilters.location === "") {
    return getInfo();
  }

  let episodeChars = null;
  if (activeFilters.episode !== "") {
    const res = await fetch(
      `https://rickandmortyapi.com/api/episode/${activeFilters.episode}`,
    );
    const data = await res.json();
    episodeChars = data.characters.map((url) => url.split("/").pop());
  }

  let locationChars = null;
  if (activeFilters.location !== "") {
    const res = await fetch(
      `https://rickandmortyapi.com/api/location/${activeFilters.location}`,
    );
    const data = await res.json();
    locationChars = data.residents.map((url) => url.split("/").pop());
  }

  let finalIds = [];
  if (episodeChars && locationChars) {
    finalIds = episodeChars.filter((id) => locationChars.includes(id));
  } else {
    finalIds = episodeChars || locationChars || [];
  }

  if (finalIds.length > 0) {
    callback(`https://rickandmortyapi.com/api/character/${finalIds.join(",")}`);
  } else {
    appBoard.innerHTML =
      "<p class='error'>No hay coincidencias en esta dimensión.</p>";
  }
}

// --- 3. EVENTOS (LISTENERS) ---

// Navegación Principal y Título
header.addEventListener("click", (e) => {
  const isTitleClick = e.target.closest(".main__title");
  const btn = e.target.closest(".nav-btn");

  if (isTitleClick) {
    header.classList.add("is-intro");
    appBoard.innerHTML = "";
    pagination.innerHTML = "";
    if (searchInput) searchInput.value = "";
    return;
  }

  if (btn) {
    header.classList.remove("is-intro");
    endPoint = btn.id;
    currentPage = 1;
    activeFilters = { episode: "", location: "" };
    if (selectEpisodes) selectEpisodes.value = "";
    if (selectLocations) selectLocations.value = "";
    updateFilterVisibility();
    getInfo();
  }
});

// Buscador (Submit)
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = searchInput.value.trim();

    if (value.length >= 2) {
      header.classList.remove("is-intro");
      if (selectEpisodes) selectEpisodes.value = "";
      if (selectLocations) selectLocations.value = "";
      activeFilters = { episode: "", location: "" };
      if (!endPoint) endPoint = "character";
      handleNavigationAndSearch(value, "search", endPoint, getInfoFromUrl);
    } else if (value.length === 0) {
      getInfo();
    }
  });
}

// Filtros (Selects)
if (selectEpisodes) {
  selectEpisodes.addEventListener("change", (e) => {
    handleNavigationAndSearch(
      e.target.value,
      "filter-episode",
      endPoint,
      getInfoFromUrl,
    );
  });
}

if (selectLocations) {
  selectLocations.addEventListener("change", (e) => {
    handleNavigationAndSearch(
      e.target.value,
      "filter-location",
      endPoint,
      getInfoFromUrl,
    );
  });
}

// --- 4. INICIALIZACIÓN ---

function updateFilterVisibility() {
  const selects = document.querySelectorAll(
    "#selectEpisodes, #selectLocations",
  );
  const displayValue = endPoint === "character" ? "block" : "none";
  selects.forEach((s) => (s.style.display = displayValue));
}

const populateSelects = async (type) => {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/${type}`);
    const data = await response.json();
    const ids = Array.from({ length: data.info.count }, (_, i) => i + 1);
    const resAll = await fetch(
      `https://rickandmortyapi.com/api/${type}/${ids.join(",")}`,
    );
    const allData = await resAll.json();
    const select = document.querySelector(
      type === "episode" ? "#selectEpisodes" : "#selectLocations",
    );

    allData.forEach((item) => {
      let option = document.createElement("option");
      option.value = item.id;
      option.textContent =
        type === "episode" ? `${item.name} (${item.episode})` : item.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(`Error llenando select ${type}:`, error);
  }
};

header.classList.add("is-intro");
populateSelects("episode");
populateSelects("location");
