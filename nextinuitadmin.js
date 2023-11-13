const new_id_base = 'nextinuit00000';

document.addEventListener('DOMContentLoaded', () => {
    displayObjects();
    document.getElementById('objectForm').addEventListener('submit', addObject);
    document.getElementById('csvFileInput').addEventListener('change', importCsv);
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('clear-button').addEventListener('click', clearSearch);
});

function addObject(e) {
    e.preventDefault();
    const titel = document.getElementById('titel').value;
    const datumIn = new Date().toISOString().split('T')[0];
    const newObject = {
        id: `${new_id_base}${String(objectDatabase.length + 1).padStart(5, '0')}`,
        titel: titel,
        datumIn: datumIn,
        datumUit: '',
        status: 'in'
    };
    objectDatabase.push(newObject);
    saveToLocalStorage();
    displayObjects();
    e.target.reset();
}

function displayObjects(objects = objectDatabase) {
    const listContainer = document.getElementById('object-lijst');
    listContainer.innerHTML = '';
    objects.forEach(obj => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'object-item';
        itemDiv.textContent = `ID: ${obj.id} Titel: ${obj.titel} Datum In: ${obj.datumIn} Datum Uit: ${obj.datumUit} Status: ${obj.status}`;
        listContainer.appendChild(itemDiv);
    });
}

function importCsv(e) {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            const csvData = event.target.result;
            objectDatabase = parseCsv(csvData);
            saveToLocalStorage();
            displayObjects();
        };
    } else {
        alert('Geen bestand geselecteerd');
    }
}

function parseCsv(data) {
    const csvRows = data.split(/\r\n|\n/);
    const headers = csvRows[0].split(',');
    return csvRows.slice(1).map(row => {
        const values = row.split(',');
        const obj = headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
        return obj;
    });
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
    let csvStr = '';
    const headers = Object.keys(array[0]).filter(header => header !== 'omschrijving');
    csvStr += headers.join(',') + '\r\n';
    for (const row of array) {
        const filteredRow = headers.map(header => row[header]);
        csvStr += filteredRow.join(',') + '\r\n';
    }
    return csvStr;
}

function importCSVAndGenerateQR() {
  // Create an input element to accept the CSV file
  let inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '.csv';
  
  inputElement.onchange = e => {
    let file = e.target.files[0];
    Papa.parse(file, {
      complete: function(results) {
        results.data.forEach((row, index) => {
          if (row.length > 0 && row[0].trim() !== '') {
            // Generate QR Code for each row
            let qrCode = new QRCode(document.createElement('div'), {
              text: row[0],
              width: 128,
              height: 128,
              correctLevel : QRCode.CorrectLevel.H
            });
            
            // Trigger download
            let canvas = qrCode._oDrawing._elCanvas; // Access the canvas element
            let filename = row[0].replace(/\W+/g, '_') + '.png'; // Sanitize the string for use as a filename
            
            canvas.toBlob(function(blob) {
              let link = document.createElement('a');
              link.download = filename;
              link.href = URL.createObjectURL(blob);
              link.click();
            });
          }
        });
      }
    });
  };

  // Trigger the file input click event
  inputElement.click();
}

function saveToLocalStorage() {
    localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
}

// Nieuwe filterfuncties
function filterById(id) {
    return objectDatabase.filter(obj => obj.id.toLowerCase().includes(id.toLowerCase()));
}

function filterByTitle(title) {
    return objectDatabase.filter(obj => obj.titel.toLowerCase().includes(title.toLowerCase()));
}

function filterByStatus(status) {
    return objectDatabase.filter(obj => obj.status === status);
}

// Functie die wordt aangeroepen bij het klikken op de zoekknop
function performSearch() {
    const searchId = document.getElementById('search-id').value;
    const searchTitle = document.getElementById('search-title').value;
    const statusIn = document.getElementById('status-in').checked;
    const statusUit = document.getElementById('status-uit').checked;

    let results = objectDatabase;

    if (searchId) {
        results = filterById(searchId);
    }
    
    if (searchTitle) {
        results = filterByTitle(searchTitle);
    }

    if (statusIn) {
        results = filterByStatus('in');
    } else if (statusUit) {
        results = filterByStatus('uit');
    }

    displayObjects(results);
}

// Wisfunctie om zoekvelden te legen en de volledige lijst weer te geven
function clearSearch() {
    document.getElementById('search-id').value = '';
    document.getElementById('search-title').value = '';
    document.getElementById('status-in').checked = false;
    document.getElementById('status-uit').checked = false;
    displayObjects(); // Toont alle objecten
}

