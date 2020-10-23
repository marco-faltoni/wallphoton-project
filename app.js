// codice key per l'autenticazione pexels
const auth = "563492ad6f917000010000019827492feb944b07bd6ed02f85890293";
// contenitore galleria
const gallery = document.querySelector('.gallery');
// l'input
const searchInput = document.querySelector('.search-input');
// il form
const form = document.querySelector('.search-form');
// il bottone more
const more = document.querySelector('.more');

let searchValue;
let PexelLink;
let page = 1;
let CurrentSearch;

// aggiungo un evento in cattura dell'input e gli passo una funzione che recupera il valore dell'input
searchInput.addEventListener('input', updateInput);

form.addEventListener('submit', (e)=> {
    e.preventDefault();
    CurrentSearch = searchValue;
    SearchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

function updateInput(e){
    searchValue = event.target.value;
}

// creo una funziona asincrona che mi permette di interrogare l'API e ricevere dei dati con metodo GET
async function ApiData (url){
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    console.log(data);
    
    // ritorno i dati convertiti
    return data;
}

function genPictures(data){
    // ciclo l'array contenente le foto
    data.photos.forEach(photo => {
        // ad ogni ciclo creo un div a cui aggiungo una classe per stilarla, e l'appendo al div contenitore creato in partenza
        console.log(photo);
        
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = ` 
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href="${photo.src.original}" target="_blank" rel="noreferrer">Download</a>
        </div> 
        <img src="${photo.src.large}" alt=""> `;
        gallery.appendChild(galleryImg);
    });
}

// creo una funziona asincrona che mi permette di interrogare l'API e ricevere dei dati con metodo GET
async function curatedPhotos(){
    PexelLink = "https://api.pexels.com/v1/curated?per_page=15";
    const data = await ApiData(PexelLink);
    genPictures(data);
}

async function SearchPhotos(value){
    clear();
    PexelLink = `https://api.pexels.com/v1/search?query=${value}+query&per_page=15&page=1`;
    const data = await ApiData(PexelLink);
    genPictures(data);
}

async function loadMore(){
    page++;
    if (CurrentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${CurrentSearch}+query&per_page=15&page=${page}`;
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await ApiData(fetchLink);
    genPictures(data);

}

function clear(){
    gallery.innerHTML = '';
    searchInput.value = '';
}

curatedPhotos();