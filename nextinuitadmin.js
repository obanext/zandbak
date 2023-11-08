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
}

function displayObjects() {
    const listContainer = document.getElementById('object-lijst');
    listContainer.innerHTML = ''; 
    objectDatabase.forEach(obj => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'object-item';
        itemDiv.textContent = `ID: ${obj.id}, Titel: ${obj.titel}, Omschrijving: ${obj.omschrijving}, Datum In: ${obj.datumIn}, Datum Uit: ${obj.datumUit}, Status: ${obj.status}`;
        listContainer.appendChild(itemDiv);
    });
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
    document.body.appendChild(linkElement); 
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

// De rest van de functionaliteiten blijft hetzelfde als je huidige script.
