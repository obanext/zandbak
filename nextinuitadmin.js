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
  const fileInput = document.getElementById('csvFileInput');
  if (!fileInput) {
    console.error('CSV file input element not found');
    return;
  }

  // Use existing file input element instead of creating a new one
  fileInput.click();

  // Change event listener for the file input
  fileInput.onchange = e => {
    let file = e.target.files[0];
    let busyIndicator = document.getElementById('busyIndicator');
    if (!busyIndicator) {
      busyIndicator = document.createElement('div');
      busyIndicator.id = 'busyIndicator';
      busyIndicator.innerText = 'Bezig...';
      document.body.appendChild(busyIndicator);
    }
    busyIndicator.style.display = 'block';

    Papa.parse(file, {
      complete: function(results) {
        if (Array.isArray(results.data)) {
          results.data.forEach((row, index) => {
            if (Array.isArray(row) && row.length > 0 && row[0].trim() !== '') {
              let qrCode = new QRCode(document.createElement('div'), {
                text: row[0],
                width: 128,
                height: 128,
                correctLevel: QRCode.CorrectLevel.H
              });

              let canvas = qrCode._oDrawing._elCanvas;
              let filename = row[0].replace(/\W+/g, '_') + '.png';

              canvas.toBlob(function(blob) {
                let link = document.createElement('a');
                link.download = filename;
                link.href = URL.createObjectURL(blob);
                link.click();

                if (index === results.data.length - 1) {
                  busyIndicator.style.display = 'none';
                }
              });
            }
          });
        } else {
          console.error('CSV parse did not return a valid array.');
          busyIndicator.style.display = 'none';
        }
      },
      error: function(err) {
        console.error('Error parsing CSV: ', err);
        busyIndicator.style.display = 'none';
      }
    });
  };
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

