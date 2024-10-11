document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("btnBuscar");
    const texto = document.getElementById("inputBuscar");
    let peliculas = [];
    //traer las pelis
    fetch(`https://japceibal.github.io/japflix_api/movies-data.json`)
        .then(response => response.json())
        .then(data => { //nos devuelve un array
            peliculas = data;
        })
        .catch(error => {
            console.error("Error al cargar las peliculas:", error);
        });


    //busqueda de peliculas
    boton.addEventListener("click", function () {
        const textoBusqueda = texto.value.toLowerCase();
        if (textoBusqueda != "") {
            const pelisFilter = buscarPelis(peliculas, textoBusqueda);
            mostrarPelis(pelisFilter);
        }
        else {
            alert("Ingrese un texto para buscar"); //poner q hay error
        }
    });
});


//buscar pelis
function buscarPelis(peliculas, texto) {
    const peliculasFiltradas = peliculas.filter(pelicula => pelicula.title.toLowerCase().includes(texto)
        || pelicula.genres.some(genero => genero.name.toLowerCase().includes(texto))
        || pelicula.tagline.toLowerCase().includes(texto)
        || pelicula.overview.toLowerCase().includes(texto)
    );
    console.log(peliculasFiltradas);
    return peliculasFiltradas;
}

//formato estrellas
function estrellas(puntos) {
    let estrellasHtml = '';
    //mostrar las estrellas
    for (let i = 0; i < 5; i++) {
        if (i < (Math.round(puntos))) {
            estrellasHtml += '<i class="fas fa-star" style="color: gold;"></i>';
        } else if (i < puntos) { //hay media estrella
            estrellasHtml += '<i class="fas fa-star-half-alt" style="color: gold;"></i>';
        }
        else {
            estrellasHtml += '<i class="far fa-star" style="color: gold;"></i>';
        }
    }
    return estrellasHtml;
}

//function moestrar generos 
function generos(lista) {
    let frase = ""; 
    lista.forEach(genero => {
        frase += genero.name + ", ";
    });
    frase = frase.slice(0, frase.length -2);
    frase += ".";
    return frase;
}

//funcion para mostrar las peliculas buscadas
function mostrarPelis(peliculas) {
    const listaPeliculas = document.getElementById("lista");
    listaPeliculas.innerHTML = ""; //limpiar la lista
    if (peliculas.length == 0) {
        listaPeliculas.innerHTML = "<p>No hay resultados para la busqueda</p>";
    }
    else {
        peliculas.forEach(pelicula => {
            const peliculaHTML = `
                <li class="list-group-item">
                    <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offCTop" aria-labelledby="offcanvasTop" class="pelis-info">
                        <h3>${pelicula.title}</h2> 
                        <p>${pelicula.tagline}</p>
                    </div>
                    <div class="pelis-estrellas">
                        ${estrellas((pelicula.vote_average) / 2)}
                    </div>

                    <div class="offcanvas offcanvas-top" tabindex="-1" id="offCTop" aria-labelledby="offcanvasTopLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasTopLabel">${pelicula.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <span class="overview">${pelicula.overview}</span>
                            <hr>
                            <span class="generos">
                                ${generos(pelicula.genres)}
                                <button style="color:black; background-color: pink;" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Mas</button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Año: ${pelicula.release_date.slice(0, 4)}</a></li>
                                    <li><a class="dropdown-item" href="#">Duración: ${pelicula.runtime} min</a></li>
                                    <li><a class="dropdown-item" href="#">Presupuesto: $${pelicula.budget}</a></li>
                                    <li><a class="dropdown-item" href="#">Ganancia: $${pelicula.revenue}</a></li>
                                </ul>
                            
                            
                            </span>
                        </div>
                    </div>
                </li>
                    `;
            listaPeliculas.innerHTML += peliculaHTML;
        });
    }
}