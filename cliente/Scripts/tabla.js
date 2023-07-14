import {generarInfoHeroe, filterListaHeroesEditoriales} from './script.js';
import {getTodoFetch} from './peticiones.js';
export const createTable = (data, keysMostrar) => {
    if(!Array.isArray(data) || data.length === 0) return null;
    const table = document.createElement('table');
    table.setAttribute('class', 'table table-dark table-hover table-striped-columns');
    table.appendChild(createHeader(data[0], keysMostrar));
    table.appendChild(createBody(data, keysMostrar));
    return table;
};

const createHeader = (element, keysMostrar) => {
    if(!element || element == null) return null;
    const tHead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const key in element) {
        if(key === 'id') continue;
        if(keysMostrar.includes(key)){
            const th = document.createElement('th');
            th.style.textAlign = 'center';
            th.setAttribute('scope', 'col');
            th.textContent = key;
            headRow.appendChild(th);
        }
    }
    tHead.appendChild(headRow);
    return tHead;
};

const createBody = (data, keysMostrar) => {
if(!Array.isArray(data)) return null;
    const tBody = document.createElement('tbody');
    data.forEach((element) => {
        const tr = document.createElement('tr');
        for (const key in element) {
            if(key === 'id'){
                tr.setAttribute('data-id', element[key]);
            }
            else{
                if(keysMostrar.includes(key)){
                    const td = document.createElement('td');
                    td.style.textAlign = 'center';
                    td.textContent = element[key];
                    tr.appendChild(td);
                }
            } 
        }
        tBody.appendChild(tr);
    });
    return tBody;
};

export const updateTable = (container, data, keysMostrar) => {
    while(container.hasChildNodes()){
        container.removeChild(container.firstElementChild);
    }
    const table = createTable(data, keysMostrar);
    if(table !== null){
        container.appendChild(table);
    }
};

export const createFilterBar = (data) => {
    const container = document.getElementById('filtros');
    const keysMostrar = localStorage.getItem('checks');
    const keys = [];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    data.forEach((key)=>{
        const div = document.createElement('div');
        div.setAttribute('class', "form-check-inline");
        div.style.fontWeight = "bold";
        // div.style.marginRight = "10px";
        const checkBox = document.createElement('input');
        checkBox.setAttribute('class', "form-check-input")
        checkBox.type = 'checkbox';
        if(!keysMostrar.includes(key)){
            checkBox.checked = false;
        }
        else{
            checkBox.checked = true;
        }
        checkBox.setAttribute('id', key);
        const label = document.createElement('label');
        label.textContent = key;
        label.style.paddingLeft = '5px';

        div.appendChild(checkBox);
        div.appendChild(label);
        container.appendChild(div);
    })
};

export const crearSelectEditoriales = (data, heroes) => {
    const container = document.getElementById('select-editorial');
    // container.style.marginRight = '400px';
    container.setAttribute('class', 'dropdown');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const botonPpal = document.createElement('button');
    botonPpal.setAttribute('class', 'btn btn-secondary dropdown-toggle');
    botonPpal.setAttribute('type', 'button');
    botonPpal.setAttribute('data-bs-toggle', 'dropdown');
    botonPpal.setAttribute('aria-expanded', false);
    botonPpal.style.textTransform = 'uppercase';
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'dropdown-menu');
    const seleccionado = localStorage.getItem('selectUsado') || 'todos';
    data.forEach((item)=>{
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item');
        a.setAttribute('id', item);
        a.textContent = item;
        a.style.textTransform = 'uppercase';
        botonPpal.textContent = localStorage.getItem('selectUsado');
        a.addEventListener('click', async ()=>{
            const heroes =  await getTodoFetch('http://localhost:3000/superheroes');
            const tablaSeccion = document.getElementById('table');
            localStorage.setItem('selectUsado', a.textContent);
            const criterio = localStorage.getItem('selectUsado');
            generarInfoHeroe(filterListaHeroesEditoriales(heroes, a.textContent));
            updateTable(tablaSeccion, filterListaHeroesEditoriales(heroes, criterio), localStorage.getItem('checks'));
            botonPpal.textContent = localStorage.getItem('selectUsado');

        });
        a.setAttribute('href', '#');
        li.appendChild(a);
        ul.appendChild(li);
        
    });
    container.appendChild(botonPpal);
    container.appendChild(ul);
}








