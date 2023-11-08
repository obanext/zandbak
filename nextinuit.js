// Een array om de objecten op te slaan
let objectDatabase = [];

// Deze functie wordt aangeroepen wanneer het document geladen is
document.addEventListener('DOMContentLoaded', (event) => {
    // Event listener voor het object toevoegen formulier
    document.getElementById('objectForm').addEventListener('submit', addObject);
    
    // Toon de initiele lijst van objecten
    displayObjects();
});

// Functie om een object toe te voegen
function addObject(e) {
    e.preventDefault();

    // Verzamel de waarden van het formulier
    let titel = document.getElementById('titel').value;
    let omschrijving = document.getElementById('omschrijving').value;
    let datumIn = new Date().toISOString().split('T')[0]; // Vandaag's datum in ISO formaat

    // Maak een nieuw object en voeg het toe aan de database
    let newObject = {
        id: objectDatabase.length + 1, // Simpele auto-increment ID
        titel: titel,
        omschrijving: omschrijving,
        datumIn: datumIn,
        datumUit: '', // Leeg voor nu
        status: 'in' // Standaard status
    };

    objectDatabase.push(newObject);
    
    // Reset het formulier
    document.getElementById('objectForm').reset();

    // Toon de bijgewerkte lijst
    displayObjects();
}

// Functie om de lijst van objecten te tonen
function displayObjects() {
    let listContainer = document.getElementById('object-lijst');
    listContainer.innerHTML = ''; // Leeg de container

    // Maak een tabel en voeg de kolomkoppen toe
    let table = document.createElement('table');
    let headerRow = table.insertRow();
    let headers = ["ID", "Titel", "Omschrijving", "Datum In", "Datum Uit", "Status"];
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    // Voeg een rij toe voor elk object in de database
    objectDatabase.forEach(obj => {
        let row = table.insertRow();
        Object.values(obj).forEach(text => {
            let cell = row.insertCell();
            cell.textContent = text;
        });
    });

    listContainer.appendChild(table); // Voeg de tabel toe aan de container
}
