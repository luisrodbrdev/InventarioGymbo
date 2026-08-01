const URL_API_GOOGLE = "https://script.google.com/macros/s/AKfycbxKfARC6YsnLL95oBw_x65UxNlbXRKgWYIQ4anrUh4RV2qNHsKjCzeDLuQo0OozkyaqOQ/exec";
let idIntervalo = null; 

function actualizarStock() {
    fetch(URL_API_GOOGLE)
        .then(response => response.json())
        .then(productos => {
            const tarjetas = document.querySelectorAll('.product-peluche');

            tarjetas.forEach((tarjeta, index) => {
                const divStock = tarjeta.querySelector('.stock-product');

                if (divStock && productos[index]) {
                    const soloNumero = String(productos[index].Stock).split(' ')[0].trim();
                    divStock.innerHTML = `Stock Disponible: <span>${soloNumero}</span>`;
                }
            });
        })
        .catch(error => console.error("Error al obtener stock:", error));
}

const botonControl = document.getElementById('btn-api-control');
const textoBoton = botonControl.querySelector('.texto-btn');

botonControl.addEventListener('click', () => {
    if (!idIntervalo) {
        actualizarStock();
        idIntervalo = setInterval(actualizarStock, 5000);
        
        botonControl.classList.remove('api-btn-pausado');
        botonControl.classList.add('api-btn-activo');
        textoBoton.innerText = "En Vivo (Pausar)";
    } else {
        clearInterval(idIntervalo);
        idIntervalo = null;
        
        botonControl.classList.remove('api-btn-activo');
        botonControl.classList.add('api-btn-pausado');
        textoBoton.innerText = "Iniciar Tiempo Real";
    }
});

actualizarStock();