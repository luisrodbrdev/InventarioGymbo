// Tu URL oficial de Google Apps Script
const URL_API_GOOGLE = "https://script.google.com/macros/s/AKfycbxKfARC6YsnLL95oBw_x65UxNlbXRKgWYIQ4anrUh4RV2qNHsKjCzeDLuQo0OozkyaqOQ/exec";
let idIntervalo = null; 

// Función principal que va a consultar a Google Sheets
function actualizarInventario() {
    fetch(URL_API_GOOGLE)
        .then(response => response.json())
        .then(productos => {
            // Buscamos la fila donde Producto sea igual a "Peluche Gymbo"
            const pelucheGymbo = productos.find(p => p.Producto === "Peluche Gymbo");
            
            if (pelucheGymbo) {
                // Apuntamos al contenedor de stock dentro de la tarjeta del peluche
                const divStock = document.querySelector('.product-peluche .stock-product');
                
                if (divStock) {
                    // Inyectamos el número que viene de la columna 'Stock' de tu Sheets
                    divStock.innerHTML = `Stock Disponible: <span>${pelucheGymbo.Stock}</span>`;
                }
            }
        })
        .catch(error => {
            console.error("Error al conectar con Google Sheets:", error);
            const divStock = document.querySelector('.product-peluche .stock-product');
            if (divStock) divStock.innerText = "Error al cargar";
        });
}

// Vinculación y lógica del botón interruptor
const botonControl = document.getElementById('btn-api-control');
const textoBoton = botonControl.querySelector('.texto-btn');

botonControl.addEventListener('click', () => {
    if (!idIntervalo) {
        // --- ENCENDER EL EN VIVO ---
        actualizarInventario(); // Primera carga instantánea al dar clic
        idIntervalo = setInterval(actualizarInventario, 5000); // Consulta automática cada 5 segundos
        
        // Cambiamos el estilo del botón a verde activo
        botonControl.classList.remove('api-btn-pausado');
        botonControl.classList.add('api-btn-activo');
        textoBoton.innerText = "En Vivo (Pausar)";
        console.log("🔄 Temporizador activado: Consultando Sheets cada 5s.");
    } else {
        // --- PAUSAR / APAGAR EL EN VIVO ---
        clearInterval(idIntervalo); // Detiene por completo el reloj de peticiones
        idIntervalo = null; // Reseteamos la variable
        
        // Cambiamos el estilo del botón a gris pausado
        botonControl.classList.remove('api-btn-activo');
        botonControl.classList.add('api-btn-pausado');
        textoBoton.innerText = "Iniciar Tiempo Real";
        console.log("🛑 Temporizador destruido: Peticiones en pausa absoluta.");
    }
});

// Carga inicial pasiva para mostrar el stock actual al abrir la página sin activar el bucle
actualizarInventario();