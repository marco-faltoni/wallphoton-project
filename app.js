// codice key per l'autenticazione pexels
const auth = "563492ad6f917000010000019827492feb944b07bd6ed02f85890293";
// contenitore galleria
const gallery = document.querySelector('.gallery-container');

// l'input
const searchInput = document.querySelector('.search-input');
// il form
const form = document.querySelector('.search-form');
// il bottone more
const more = document.querySelector('.more');
const loader = document.querySelector('.loader');

const fullImg = document.querySelector('.full-img');
const modal = document.querySelector('.modal');

let searchValue;
let PexelLink;
let page = 1;
let CurrentSearch;

// al click di un immagine imposto lo sfondo nero e lo zoom dell'immagine cliccata
modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal')){
        modal.classList.remove('open');
        fullImg.classList.remove('open');
    }
})

// aggiungo un evento in cattura dell'input e gli passo una funzione che recupera il testo dell'input
searchInput.addEventListener('input', updateInput);

// quando l'utente clicca su search o preme invio
form.addEventListener('submit', (e)=> {
    // stoppo l'invio del form e il ricarimento della pagina
    e.preventDefault();
    // imposto la variabile non definita uguale al valore dell'input
    CurrentSearch = searchValue;
    // faccio partire la funziona che genera le immagini
    SearchPhotos(searchValue);
});

// al click del tasto more faccio partire la funziona load more
more.addEventListener("click", loadMore);

// estraggo il testo dell'input ad ogni parola digitata
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
    // console.log(data);
    
    // ritorno i dati convertiti
    return data;
}

function genPictures(data){
    // setto un timeout per fa vedere l'animazione di caricamento
    setTimeout(() => {
        // rimuovo l'animazione di caricamento
        loader.classList.remove('open');
        if (data.total_results === 0) {
            alert('no results, please verify your text or search for more');
        }
        // ciclo l'array contenente le foto
        data.photos.forEach(photo => {
            // ad ogni ciclo creo un div a cui aggiungo una classe per stilarla, e l'appendo al div contenitore creato in partenza
            console.log(photo);

            
            const galleryImg = document.createElement('div');
            galleryImg.classList.add('gallery-img');
            galleryImg.innerHTML = ` 
            <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href="${photo.photographer_url}" target="_blank" rel="noreferrer">More about this author...</a>
            </div>
            <div class="img-static">
            <img src="${photo.src.large}" alt="">
            </div> `;
            gallery.appendChild(galleryImg);
            galleryImg.children[1].addEventListener('click', () => {
                modal.children[0].src = '';
                modal.children[0].src = photo.src.large2x;
                modal.children[1].innerHTML = `<a href="${photo.src.original}" target="_blank" rel="noreferrer">Download</a>`;
                modal.classList.add('open');
                fullImg.classList.add('open');
            })
        });  
    }, 1500);

}



// creo una funziona asincrona che mi permette di interrogare l'API e ricevere dei dati con metodo GET
async function curatedPhotos(){
    loader.classList.add('open');
    PexelLink = "https://api.pexels.com/v1/curated?per_page=15";
    const data = await ApiData(PexelLink);
    genPictures(data);
}

async function SearchPhotos(value){
    // pulisco la gallery e il valore dell'input
    clear();
    // faccio apparire l'animazione di loading
    loader.classList.add('open');
    // passo all'API il link con inserito il valore dell'utente
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