import {updateTable, createFilterBar, crearSelectEditoriales} from './tabla.js'
import {SuperHeroe} from './heroe.js'
import {getHeroesAjax, getArmasAjax, getHeroeIdAjax, addHeroeAjax, getTodoFetch, modifyHeroeAjax, deleteHeroeAjax} from './peticiones.js'

const URLHEROES = 'http://localhost:3000/superheroes'
const URLARMAS = 'http://localhost:3000/armas'

//peticiones ajax
// getHeroesAjax(URLHEROES, updateTable, tableSection);
// getArmasAjax(URLARMAS, cargarSelectConArmas, document.getElementById('seleccionArmas'));
/*
    se guardo miercoles 02:05 ya solo falta bootstrap
*/
let contador = 0;
const tableSection = document.getElementById('table');
const $form = document.forms[0];
const {txtId, txtNombre, rdoEditorial, txtAlias, txtFuerza, txtArmas} = $form;
const cabeceras = JSON.parse(localStorage.getItem('checks')) || ['nombre', 'fuerza', 'alias', 'editorial', 'arma'];
localStorage.setItem('checks', JSON.stringify(cabeceras));
const filtrosSelector = ['todos', 'dc', 'marvel'];
mostrarSpinner(3000);
const heroes =  await getTodoFetch(URLHEROES);
const armas = await getTodoFetch(URLARMAS);
createFilterBar(['nombre', 'fuerza', 'alias', 'editorial', 'arma']);
crearSelectEditoriales(filtrosSelector);
cargarSelectConArmas(document.getElementById('seleccionArmas'), armas);
const keysMostrar = localStorage.getItem('checks');
const criterio = getSelect();
updateTable(tableSection, filterListaHeroesEditoriales(heroes, criterio), keysMostrar);
generarInfoHeroe(filterListaHeroesEditoriales(heroes, criterio));


$form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(txtId.value === ''){
        if(validarCampos(txtNombre.value, rdoEditorial.value, txtAlias.value, parseFloat(txtFuerza.value), txtArmas.value)){
            crearHeroe();
        }
        else{
            alert('Los campos no pueden ser vacios');
        }
    }
    else{
        if(validarCampos(txtNombre.value, rdoEditorial.value, txtAlias.value, parseFloat(txtFuerza.value), txtArmas.value)){
            if(confirm('Realmente desea modificar el heroe seleccionado?')){  
                modificarHeroe(getSuperheroeConID());
            }
            else{
                alert('Modificación cancelada');
            }
        }
        else{
            alert('Los campos no pueden quedar vacios');
        }
    }
    resetForm();
    txtId.value = '';    
});

window.addEventListener('change', (e) => {
    if(e.target.matches('input[type=checkbox]')){
        const lista =  mapearListaCheckBox();
        updateTable(tableSection, filterListaHeroesEditoriales(heroes, localStorage.getItem('selectUsado') || 'todos') , lista);
        localStorage.setItem('checks',JSON.stringify(lista));
    }
})

window.addEventListener('click', (e) => {
    if(e.target.matches('td')){
        const id = e.target.parentElement.dataset.id;
        getHeroeIdAjax(URLHEROES, loadForm, id, $form);
        mostrarBotones();
        mostrarSpinner(2000);
    }
    else if(e.target.matches('th')){
        contador++;
        ordenarPor(e.target.textContent, contador, heroes);
        updateTable(tableSection, heroes, localStorage.getItem('checks'));
    }
    else if(e.target.matches('input[value="Eliminar"]')){
        if(confirm('Realmente desea borrar el heroe seleccionado?')){
            borrarHeroe(getSuperheroeConID())
            resetForm();
        }
        else{
            alert('Eliminación cancelada');
            resetForm();
        }
        $form.txtId.value = '';
    }
    else if(e.target.matches('input[value="Cancelar"]')){
        resetForm();
        $form.txtId.value = '';
    }
    else if(e.target.matches('input[value="Buscar"]')){
        let alias = prompt('Ingrese el alias del heroe que desea buscar...');
        if(validarStrings(alias)){
            buscarHeroe(alias);
            mostrarBotones();
        }
        else{
            alert('El alias no puede ser vacio');
        }
    }
});

export function filterListaHeroesEditoriales(lista, criterio){
    if(criterio == 'todos'){
        return lista;
    }
    return lista.filter((item) => {
        return item.editorial == criterio;
    })
    
}

export function mapearListaCheckBox(){
    const checkboxes = document.querySelectorAll('#filtros input[type="checkbox"]');
    const columnasFiltrar = [];
    checkboxes.forEach((box)=>{
        if(box.checked){
            columnasFiltrar.push(box.id);
        }
    });
    return columnasFiltrar;
}

function crearHeroe(){
    const nuevoHeroe = new SuperHeroe(Date.now(), txtNombre.value.toLowerCase(), parseFloat(txtFuerza.value), txtAlias.value.toLowerCase(), rdoEditorial.value.toLowerCase(), txtArmas.value);
    addHeroeAjax(URLHEROES, nuevoHeroe);
}

function getSelect(){
    if(!localStorage.getItem('selectUsado')){
        return 'todos'
    }
    return localStorage.getItem('selectUsado');
}

function getSuperheroeConID(){
    return new SuperHeroe(txtId.value, txtNombre.value, parseFloat(txtFuerza.value), txtAlias.value, rdoEditorial.value, txtArmas.value);
}

function modificarHeroe(heroe){
    const heroeModificar = heroes.find((e) => e.id == heroe.id);
    if(!heroeModificar) return null;
    heroeModificar.nombre = heroe.nombre;
    heroeModificar.fuerza = heroe.fuerza;
    heroeModificar.alias = heroe.alias;
    heroeModificar.editorial = heroe.editorial;
    heroeModificar.arma = heroe.arma;
    modifyHeroeAjax(URLHEROES, heroeModificar);
}

function borrarHeroe(heroe){
    let heroeBorrar = heroes.find((e)=>e.id == heroe.id);
    deleteHeroeAjax(URLHEROES, heroeBorrar)
}

function loadForm($form, heroe){
    $form.txtId.value = heroe.id;
    $form.txtNombre.value = heroe.nombre;
    $form.rdoEditorial.value = heroe.editorial;
    $form.txtAlias.value = heroe.alias;
    $form.txtFuerza.value = heroe.fuerza;
    $form.txtArmas.value = heroe.arma;
}

function validarCampos(nombre, editorial, alias, fuerza, arma){
    return validarStrings(nombre) && validarStrings(editorial) && validarStrings(alias) && esFlotante(fuerza) && validarStrings(arma) ? true : false;
}

function validarStrings(string){
    return string == undefined || string == '' ? false : true;
}

function esFlotante(float){
    return isNaN(float) || float == undefined ? false : true;
}

function esEntero(int){
    return isNaN(int) || int == undefined ? false : true;
}

function mostrarBotones(){
    document.getElementById('nuevo').value = 'Modificar';
    document.getElementById('cancelar').type = 'button';
    document.getElementById('eliminar').type = 'button';
}

function ocultarBotones(){
    document.getElementById('nuevo').value = 'Nuevo';
    document.getElementById('cancelar').type = 'hidden';
    document.getElementById('eliminar').type = 'hidden';
}

function resetForm(){
    $form.reset();
    ocultarBotones();
}

function mostrarSpinner(duracion){
    const spinner = document.getElementById('spinner');
    const main = document.getElementById('main');
    spinner.style.display = 'block';
    main.style.display = 'none';
    setTimeout(() =>{
        spinner.style.display = 'none';
        main.style.display = 'flex';
    }, duracion);
}

function buscarHeroe(alias){
    const heroe = heroes.find((e)=>e.alias.toLowerCase() === alias.toLowerCase());
    loadForm($form, heroe);
}

function ordenarPor(criterio, contador, datos){
    for (let i = 0; i < datos.length -1; i++) {
        for(let j = i+1; j < datos.length; j++){
            if((datos[i][criterio] < datos[j][criterio] && contador % 2 == 0) || (datos[i][criterio] > datos[j][criterio] && contador % 2 == 1)){
                let aux = null;
                aux = datos[i];
                datos[i] = datos[j];
                datos[j] = aux;
            }
        }
    }
}

function cargarSelectConArmas(select, armasCargadas){  
    for (const key in armasCargadas) {
        let opcion = document.createElement('option');
        opcion.textContent = armasCargadas[key];
        select.appendChild(opcion);
    }
}

export function generarInfoHeroe(heroes){
    const maximaFuerza = heroes.reduce((maximo, heroe) => Math.max(maximo, heroe.fuerza), 0);
    const minimaFuerza = heroes.reduce((minimo, heroe) => Math.min(minimo, heroe.fuerza), Infinity);
    let acumuladorFuerza = heroes.reduce((acumulador, heroe) => acumulador + heroe.fuerza, 0);
    let promedioFuerza = (acumuladorFuerza / heroes.length).toFixed(2);
    mostrarInfoHeroes(maximaFuerza, minimaFuerza, promedioFuerza)
    
}

function mostrarInfoHeroes(maximo, minimo, promedio){
    
    document.getElementById('maximo').value = maximo;
    document.getElementById('minimo').value = minimo;
    document.getElementById('promedio').value = promedio;
}