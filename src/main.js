import './style.css'
import './sass/stylesheets/main.scss'
import { createCatCard } from './utils/utils';
import { initSidebar } from './utils/sidebar';
import { deleteFav } from './utils/utils';

initSidebar();

const URLCATAPI = "https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1";
let urlActual = "https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1";
let app = document.querySelector("#app");
let objetosguardados = []


const getCatInfo = async (url = urlActual, limpiar = false) => {
  try {
    const response = await fetch(url, {
      method: `GET`,
      headers: {
        'Content-type': 'application/json',
        'x-api-key': 'live_b2DbcoZCrCwjxQW05vMCtgKQcgSgDd3iApiPcC3iXAQTBg7SV3XmheJ3gHByW91p',
      }
    });

    const data = await response.json();
    if (limpiar) app.innerHTML = "";

    let mensajeError = document.querySelector("#error-mensaje");
    if (data.length === 0) {
      mensajeError.style.display = "block";
      return;
    }
    mensajeError.style.display = "none";

    // --- RENDERIZADO ---
    data.forEach(element => {
      let div = createCatCard(element);
      app.appendChild(div);

      let favBtn = div.querySelector('.card-overlay__icon-fav');

      favBtn.addEventListener('click', () => {
        favBtn.classList.toggle('active');

        if (favBtn.classList.contains('active')) {
          let favBoxes = document.querySelector(".favoritos-overlay-open__favBoxes");
          
          let divFav = createCatCard(element, true, favBtn);
          favBoxes.appendChild(divFav);

          objetosguardados.push(element);
          localStorage.setItem("cat-card", JSON.stringify(objetosguardados));
          console.log(`Gato ${element.id} añadido ❤️`);

        } else {
          const cleanId = element.id.replace('#', '');
          let gatoABorrar = document.getElementById(cleanId);
          
          if (gatoABorrar) {
              deleteFav(element.id, gatoABorrar, favBtn);
              objetosguardados = objetosguardados.filter(gato => gato.id !== element.id);
          }
        }
      });
    });

  } catch (error) {
    console.error("Conexión fallida");
  }
};
getCatInfo(); 

const breedSelect = document.querySelector('#breedSelect');

const llenarRazas = async () => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/breeds");
        const razas = await response.json();
        console.log(razas)

        razas.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza.id; 
            option.textContent = raza.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando razas:", error);
    }
};

llenarRazas();

const btnBuscar = document.querySelector('.form__button'); 
const formatSelect = document.querySelector('#formatSelect'); 

btnBuscar.addEventListener('click', async (e) => {
    e.preventDefault();

    const breedId = breedSelect.value;
    const format = formatSelect.value;

    let nuevaUrl = `https://api.thecatapi.com/v1/images/search?limit=10`;

    if (breedId !== "Todas las razas") {
        nuevaUrl += `&breed_ids=${breedId}`;
    }
    
    if (format !== "Todos los formatos") {
        nuevaUrl += `&mime_types=${format}`;
    }

    if (breedId === "Todas las razas" && format === "Todos los formatos") {
        nuevaUrl += `&has_breeds=1`;
    }

    urlActual = nuevaUrl; 
    await getCatInfo(urlActual, true); 
    
});

const dataGuardada = JSON.parse(localStorage.getItem("cat-card")) || [];

if (dataGuardada.length > 0) {
    const favBoxes = document.querySelector(".favoritos-overlay-open__favBoxes");
    
    objetosguardados = dataGuardada;

    dataGuardada.forEach(element => {
        const favCard = createCatCard(element, true);
        
        favBoxes.appendChild(favCard);
    });
    
    console.log(`✅ Se han restaurado ${dataGuardada.length} gatos favoritos.`);
}

function initPaginacion(getCatInfo, urlActual) {
    let contadorVerMas = 0;
    const contadorFinal = 5;
    
    const btnVerMas = document.querySelector(".btn-ver-mas");
    const loader = document.querySelector("#loader");

    btnVerMas?.addEventListener("click", async () => {
        loader.style.display = "block";
        btnVerMas.disabled = true; 
        btnVerMas.style.opacity = "0";

        contadorVerMas++;

        if (contadorVerMas <= contadorFinal) {
            await getCatInfo(urlActual, false);
        }

        loader.style.display = "none";
        btnVerMas.disabled = false;
        btnVerMas.style.opacity = "1";

        if (contadorVerMas === contadorFinal) {
            btnVerMas.style.display = "none";
        }
    });
}


initPaginacion(getCatInfo, urlActual);
