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

    // Create a date object and format the date and time for the filename
    const now = new Date();
    const date = now.toISOString().split('T')[0]; 
    const time = now.toTimeString().split(' ')[0].replace(/:/g, ''); 

    const filename = `${exportName}_${date}${time}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
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

    // Trigger het openen van het bestandsdialoogvenster
    fileInput.click();

    // Definieer de event handler voor het 'change' event van de file input
    fileInput.onchange = e => {
        // Creëer of vind de busyIndicator om aan te geven dat de verwerking bezig is
        let busyIndicator = document.getElementById('busyIndicator');
        if (!busyIndicator) {
            busyIndicator = document.createElement('div');
            busyIndicator.id = 'busyIndicator';
            busyIndicator.innerText = 'Bezig...'; // Dutch for 'Busy...'
            document.body.appendChild(busyIndicator);
        }
        busyIndicator.style.display = 'block';

        // Verkrijg het geselecteerde bestand
        let file = e.target.files[0];
        // Parse het bestand met PapaParse
        Papa.parse(file, {
            complete: function(results) {
                let processedCount = 0; // Houd bij hoeveel QR-codes zijn verwerkt

                // Loop door de data die door PapaParse is teruggegeven
                results.data.forEach((row, index) => {
                    // Controleer of de rij geldige data bevat
                    if (Array.isArray(row) && row.length > 0 && row[0].trim() !== '') {
                        try {
                            // Genereer een QR-code voor elke rij
                            let qr = qrcode(0, 'L');
                            qr.addData(row[0]);
                            qr.make();
                            let imgTag = qr.createImgTag(4); // Maak een <img> tag als string

                            // Zet de image tag om naar een downloadbaar afbeeldingselement
                            let tempDiv = document.createElement('div');
                            tempDiv.innerHTML = imgTag;
                            let imgElement = tempDiv.firstChild;
                            let canvas = document.createElement('canvas');
                            let context = canvas.getContext('2d');
                            let image = new Image();
                            image.onload = function() {
                                canvas.width = image.width;
                                canvas.height = image.height;
                                context.drawImage(image, 0, 0);
                                canvas.toBlob(function(blob) {
                                    let filename = row[0].replace(/\W+/g, '_') + '.png';
                                    let link = document.createElement('a');
                                    link.download = filename;
                                    link.href = URL.createObjectURL(blob);
                                    link.click(); // Initieer de download
                                    processedCount++;
                                    // Als alle QR-codes zijn verwerkt, verberg de busyIndicator
                                    if (processedCount === results.data.length) {
                                        busyIndicator.style.display = 'none';
                                    }
                                });
                            };
                            image.src = imgElement.src;
                        } catch (error) {
                            console.error('Error generating QR code for row: ', row, error);
                            processedCount++;
                            // Verberg de busyIndicator als er een fout optreedt
                            if (processedCount === results.data.length) {
                                busyIndicator.style.display = 'none';
                            }
                        }
                    } else {
                        processedCount++; // Incrementeer ook als de rij niet verwerkt wordt
                        // Verberg de busyIndicator als alle rijen zijn gecontroleerd
                        if (processedCount === results.data.length) {
                            busyIndicator.style.display = 'none';
                        }
                    }
                });
            },
            error: function(err) {
                console.error('Error parsing CSV: ', err);
                // Verberg de busyIndicator in geval van een fout
                busyIndicator.style.display = 'none';
            }
        });
    };
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


function clearSearch() {
    document.getElementById('search-id').value = '';
    document.getElementById('search-title').value = '';
    document.getElementById('status-in').checked = false;
    document.getElementById('status-uit').checked = false;
    displayObjects(); // Toont alle objecten
}

