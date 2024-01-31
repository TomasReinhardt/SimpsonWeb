var pageCharacters = 1;
var arrayCharacters = [];
var arrayCharactersAux = [];
var searchString = "";

//Obetener la informacion de la api
async function loadCharacters() {
    const response = await fetch("https://apisimpsons.fly.dev/api/personajes?limit=20&page="+pageCharacters);
    const characters = await response.json();
    arrayCharacters = arrayCharacters.concat(characters.docs);
    
    if(characters.nextPage != null){
        pageCharacters = characters.nextPage
    }else {
        $('#nextPage').hide();;
    }
    loadCharactersBox();
}

//Cargar la información en el html
function loadCharactersBox() {

    let contentDiv = $('#charactersDiv');

    contentDiv.find(".characterBox").remove();

    arrayCharacters.forEach(function (character,i) {
        node = 
            `
                <div id="char${i}" class="characterBox">
                    <div onclick="loadCharacter('${character._id}')" class="character">
                        <img src="${character.Imagen}" alt="${character.Nombre}">
                        <span>${character.Nombre}</span>
                    </div>
                </div>
            `
        contentDiv.append(node);

        setTimeout(()=> {
            $('#char'+i).addClass("opacity1");
        },100*i)
    });
}

//Guardar informacion de un personaje x
function loadCharacter(id){
    let find = arrayCharacters.find(character=> {
        if(character._id == id){
            localStorage.setItem("character",JSON.stringify(character))
            return true;
        }
    })
    if(find){
        window.location.href = "https://simpsonsweb.up.railway.app/views/character.html"
    }
}

//Recuperar informacion y mostrarla
function saveCharacter() {
    let character = JSON.parse(localStorage.getItem("character"));
    let contentDiv = $('#characterCard');

    let state = "";
    let occupation = "Desconocida"

    if(character.Estado == "Vivo"){
        state = "live";
    }else if (character.Estado == "Fallecido"){
        state = "dead";
    }

    node = 
    `
        <div id="card">
            <div id="img">
                <span></span>            
                <img src="${character.Imagen}" alt="${character.Nombre}">
            </div>
            <div id="info">
                <h2>${character.Nombre}</h3>
                <h5>(${character.Genero})</h5>
                <h4 id="state" class="${state}" >Estado: &nbsp;<i>${character.Estado}</i></h4>
                <h4>Ocupacion: <i>${character.Ocupacion}</i></h4>
                <h4>Historia:</h4>
                <p>${character.Historia}</p>
            </div>
        </div>
    `
    contentDiv.append(node);
}

//Obtener las citas y cargarlas en el html
async function getQuote() {
    const response = await fetch("https://thesimpsonsquoteapi.glitch.me/quotes?character=");
    const quote = await response.json();
    let contentDiv = $('#quote');
    contentDiv.find("#imgQuote").remove();
    contentDiv.find("#quoteInfo").remove();
    
    node = 
    `
        <div id="imgQuote">
            <img src="${quote[0].image}" alt="${quote[0].character}">
        </div>
        <span id="quoteInfo">
            <h5>${quote[0].character}:</h5>
            <p>${quote[0].quote}</p>
        </span>
    `

    contentDiv.append(node);
}

function moveLabel(labelId) {
    $('#'+labelId).addClass("inputSelect");
}

function moveLabelR(labelId) {
    $('#'+labelId).removeClass("inputSelect");
}

function validateForm(event) {
    event.preventDefault();
    let todoOk = true;

    let correo = $("#inputEmail").val();
    let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    let nombre = $("#inputName").val();
    let apellido = $("#inputLastName").val();
    let validNombreApellido = /^[A-Z]+$/i;

    let date = $("#inputDate")[0].value;

    let check = $("#exampleCheck1")[0].checked;

    if(!validEmail.test(correo) || !validNombreApellido.test(nombre) || !validNombreApellido.test(apellido) || !check || date==""){
        todoOk = false;
    }

    if(todoOk){
        Swal.fire({
            title: 'Excelente',
            text: 'Bienvenido a nuestra comunidad',
            imageUrl: 'https://static.simpsonswiki.com/images/8/8d/Angel_Lisa.png',
            imageHeight: 200,
        })
    }else {
        Swal.fire({
            title: 'Oops...',
            text: 'No sabes escribir?',
            imageUrl: 'https://static.simpsonswiki.com/images/thumb/3/35/Lisafer_Simpson.png/200px-Lisafer_Simpson.png',
            imageHeight: 200,
          })
    }
}


window.onload = function() {
    let url = location.href.split("/")
    let pageActual = url[url.length-1];
    switch(pageActual) {
        case "characters.html":
            loadCharacters();
            break;
        case "character.html":
            saveCharacter();
            break;
        case "quote.html":
            getQuote();
            break;
        case "":
            var intro = new Audio("./js/intro.mp3");
            intro.volume -= 0.9;
            intro.play();
            break;
    }
};


