// `nextinuitadmin.js`
let objectDatabase = [];

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.getElementById('objectForm').addEventListener('submit', addObject);
    displayObjects();
});

function addObject(e) {
    e.preventDefault();

    let titel = document.getElementById('titel').value;
    let omschrijving = document.getElementById('omschrijving').value;
    let datumIn = new Date().toISOString().split('T')[0];

    let newObject = {
        id: objectDatabase.length + 1, // Verhoogt de ID voor elk nieuw object
        titel: titel,
        omschrijving: omschrijving,
        datumIn: datumIn,
        datumUit: '', // Initieel leeg
        status: 'in' // Initieel op 'in' gezet
    };

    objectDatabase.push(newObject);
    saveToLocalStorage();
    displayObjects();
    
    document.getElementById('objectForm').reset(); // Reset het formulier na het toevoegen
}

function displayObjects() {
    const listContainer = document.getElementById('object-lijst');
    listContainer.innerHTML = ''; // Maak de bestaande lijst leeg

    let table = document.createElement('table');
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let headers = ['ID', 'Titel', 'Omschrijving', 'Datum In', 'Datum Uit', 'Status'];
    
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    
    let tbody = table.createTBody();
    
    objectDatabase.forEach(obj => {
        let row = tbody.insertRow();
        Object.values(obj).forEach(text => {
            let cell = row.insertCell();
            cell.textContent = text;
        });
    });

    listContainer.appendChild(table); // Voeg de nieuwe tabel toe aan de container
}

function saveToLocalStorage() {
    localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
}

function loadFromLocalStorage() {
    let storedObjects = localStorage.getItem('objectDatabase');
    if (storedObjects) {
        objectDatabase = JSON.parse(storedObjects);
    }
}
