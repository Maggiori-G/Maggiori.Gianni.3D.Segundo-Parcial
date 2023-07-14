//ajax

export const getHeroesAjax = (url, callback, seccion) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState ==  4){
            if(xhr.status >=200 && xhr.status < 300){
                const data = JSON.parse(xhr.responseText);
                callback(seccion, data);
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open('GET', url)
    xhr.send();
}

export const getArmasAjax = (url, callback, seccion) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState ==  4){
            if(xhr.status >=200 && xhr.status < 300){
                const data = JSON.parse(xhr.responseText);
                callback(seccion, data);
                return data;
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open('GET', url)
    xhr.send();
}

export const getHeroeIdAjax = (url, callback, id, form) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState ==  4){
            if(xhr.status >=200 && xhr.status < 300){
                const data = JSON.parse(xhr.responseText);
                callback(form, data);
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open('GET', url+'/'+id)
    xhr.send();
}

export const addHeroeAjax = (url, data) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                const sh = JSON.parse(xhr.responseText);
                console.log(sh);
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
};

export const modifyHeroeAjax = (url, data) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                const sh = JSON.parse(xhr.responseText);
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open("PUT", url+'/'+data.id);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
};

export const deleteHeroeAjax = (url, data) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                const sh = JSON.parse(xhr.responseText);
            }
            else{
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    });
    xhr.open("DELETE", url+'/'+data.id);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
};

export const getTodoFetch = async (URL) => {
    try {
        let res = await fetch(URL);
        if (!res.ok) throw Error(`Error: ${res.status} - ${res.statusText}`);
        let data = await res.json();
        return data;
    } catch (err) {
        console.error(err.message);
    }
};