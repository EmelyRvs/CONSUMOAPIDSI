const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const filterBtns = document.querySelectorAll('.filter-btn');

let allCharacters = []; // Aquí guardaremos la base de datos completa

// Función para obtener los datos de la API
async function fetchCharacters() {
    try {
        resultsContainer.innerHTML = '<p class="loading">Invocando el mapa del merodeador... 🪄</p>';
        
        // Consumimos la HP-API
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        const data = await response.json();
        
        // Filtramos para quedarnos solo con los que tienen imagen para que el portal se vea bien
        allCharacters = data.filter(char => char.image !== '');
        
        // Mostramos los primeros 12 resultados al cargar
        displayResults(allCharacters.slice(0, 12));
        
    } catch (error) {
        resultsContainer.innerHTML = '<p class="loading">Error mágico. No se pudo conectar a Hogwarts.</p>';
        console.error("Error en la API:", error);
    }
}

// Función para dibujar las tarjetas
function displayResults(characters) {
    resultsContainer.innerHTML = '';
    
    if (characters.length === 0) {
        resultsContainer.innerHTML = '<p class="loading">No se encontró ningún mago con esos datos.</p>';
        return;
    }

    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Asignamos el color de borde según la casa
        let houseColor = '#d4af37';
        if (char.house === 'Gryffindor') houseColor = '#740001';
        if (char.house === 'Slytherin') houseColor = '#1a472a';
        if (char.house === 'Ravenclaw') houseColor = '#222f5b';
        if (char.house === 'Hufflepuff') houseColor = '#eeb939';

        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}">
            <div class="card-content" style="border-top-color: ${houseColor};">
                <h3>${char.name}</h3>
                <p class="info"><strong>🛡️ Casa:</strong> ${char.house || 'Desconocida'}</p>
                <p class="info"><strong>🩸 Linaje:</strong> ${char.ancestry || 'Desconocido'}</p>
                <p class="info"><strong>🪄 Varita:</strong> ${char.wand.wood ? char.wand.wood : 'Desconocida'}</p>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Evento: Búsqueda dinámica mientras el usuario escribe
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    // Filtramos la base de datos buscando coincidencias en el nombre
    const filteredChars = allCharacters.filter(char => 
        char.name.toLowerCase().includes(query)
    );
    
    displayResults(filteredChars);
});

// Eventos: Filtrado al hacer clic en los botones de las Casas
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Quitamos la clase "active" a todos los botones y se la ponemos al que se le dio clic
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const house = e.target.getAttribute('data-house');
        searchInput.value = ''; // Limpiamos la barra de búsqueda
        
        if (house === 'All') {
            displayResults(allCharacters.slice(0, 16)); // Mostramos una muestra
        } else {
            const filteredByHouse = allCharacters.filter(char => char.house === house);
            displayResults(filteredByHouse);
        }
    });
});

// Iniciar el portal
document.addEventListener('DOMContentLoaded', fetchCharacters);