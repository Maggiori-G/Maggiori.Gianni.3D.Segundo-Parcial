import {getTodoFetch} from './peticiones.js'

const URLHEROES = 'http://localhost:3000/superheroes'
const heroes = await getTodoFetch(URLHEROES);
mostrarHeroes(document.getElementById('cardHeroes'), heroes);



function mostrarHeroes(contenedor, listaHeroes){
    listaHeroes.forEach((e)=>{
        crearHeroe(contenedor, e);
    });
}

function crearHeroe(contenedor, heroe){
    if(heroe==null) return null;
    const div = document.createElement('div');
    div.style.width = '30%'
    div.setAttribute('class', 'class=card text-bg-warning mb-3');
    const divBody = document.createElement('div');
    divBody.setAttribute('class', 'card-body');
    div.appendChild(crearTitulo(heroe['nombre']));
    divBody.appendChild(crearH5(heroe['editorial']));
    divBody.appendChild(crearDivConImagenYTexto(heroe['alias'], './Imagenes/icono_'+'alias'+'.png'));
    divBody.appendChild(crearDivConImagenYTexto(heroe['fuerza'], './Imagenes/icono_'+'fuerza'+'.png'));
    divBody.appendChild(crearDivConImagenYTexto(heroe['arma'], './Imagenes/icono_'+'arma'+'.png'));
    div.appendChild(divBody);
    contenedor.appendChild(div);
}

function crearTitulo(contenido){
    const titulo = document.createElement('div');
    titulo.setAttribute('class', 'card-header');
    const nombre = document.createElement('h3');
    nombre.textContent = contenido;
    nombre.style.textTransform = 'capitalize';
    titulo.appendChild(nombre);
    return titulo;
}

function crearParrafo(contenido){
    const item = document.createElement('p');
    item.textContent = contenido;
    return item;
}

function crearDivConImagenYTexto(contenido, path, valor){
    const div = document.createElement('div');
    const span = document.createElement('span');
    const img = document.createElement('img');
    const titulo = document.createElement('label');
    titulo.textContent = valor;
    titulo.style.textTransform = 'capitalize';
    img.style.paddingRight = '10px';
    img.setAttribute('src', path);
    span.textContent = contenido;
    span.style.textTransform = 'capitalize';
    span.setAttribute('class', 'card-text');
    div.appendChild(img);
    div.appendChild(span);
    return div;
}

function crearH5(contenido){
    const div = document.createElement('div');
    const h5 = document.createElement('h5');
    h5.style.textTransform = 'capitalize';
    h5.setAttribute('class', 'card-title');
    h5.textContent = contenido;
    return h5;
}

