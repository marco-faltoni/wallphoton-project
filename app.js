const auth = "563492ad6f917000010000019827492feb944b07bd6ed02f85890293";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
let searchValue;
let PexelLink;

searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e)=> {
    e.preventDefault();
    SearchPhotos(searchValue);
})

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
        galleryImg.innerHTML = `<img src="${photo.src.large}" alt=""> <p>${photo.photographer}</p> `;
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

function clear(){
    gallery.innerHTML = '';
    searchInput.value = '';
}

curatedPhotos();