let objectDatabase = [];

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.getElementById('objectForm').addEventListener('submit', addObject);
    displayObjects();
});

function addObject(e) {
    e.preventDefault();

    const titel = document.getElementById('titel').value;
    const omschrijving = document.getElementById('omschrijving').value;
    const datumIn = new Date().toISOString().split('T')[0];

    const newObject = {
        id: objectDatabase.length + 1,
        titel: titel,
        omschrijving: omschrijving,
        datumIn: datumIn,
        datumUit: '',
        status: 'in'
    };

    objectDatabase.push(newObject);
    saveToLocalStorage();
    displayObjects();
    
    e.target.reset();
function displayObjects() {
    const listContainer = document.getElementById('object-lijst');
    if (!listContainer) {
        console.error('Element met ID "object-lijst" niet gevonden.');
        return; // Stop de functie als het element niet gevonden wordt.
    }

    listContainer.innerHTML = ''; // Maak de container leeg voordat we nieuwe gegevens toevoegen

    const table = document.createElement('table');
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ['ID', 'Titel', 'Omschrijving', 'Datum In', 'Datum Uit', 'Status'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    const tbody = table.createTBody();
    objectDatabase.forEach(obj => {
        const row = tbody.insertRow();
        Object.values(obj).forEach(val => {
            const cell = row.insertCell();
            cell.textContent = val;
        });
    });

    listContainer.appendChild(table); // Voeg de voltooide tabel toe aan de lijstcontainer
}

function saveToLocalStorage() {
    localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
}

function loadFromLocalStorage() {
    const storedObjects = localStorage.getItem('objectDatabase');
    if (storedObjects) {
        objectDatabase = JSON.parse(storedObjects);
        displayObjects();
    }
}

function downloadObjectAsCsv(exportObj, exportName) {
    const csvStr = convertToCSV(exportObj);
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName + '.csv');
    document.body.appendChild(linkElement); // Required for Firefox
    linkElement.click();
    document.body.removeChild(linkElement);
}

function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let csvStr = `${Object.keys(array[0]).join(',')}\r\n`;

    for (const row of array) {
        csvStr += `${Object.values(row).join(',')}\r\n`;
    }

    return csvStr;
}

// Voeg een knop toe aan je HTML om deze functie aan te roepen:
// <button onclick="downloadObjectAsCsv(objectDatabase, 'objecten')">Download CSV</button>
