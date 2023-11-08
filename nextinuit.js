// Een array om de objecten op te slaan
let objectDatabase = [];

// Laad de objecten uit de lokale opslag wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();

    // Voeg een event listener toe aan het formulier als dat bestaat op deze pagina
    const objectForm = document.getElementById('objectForm');
    if (objectForm) {
        objectForm.addEventListener('submit', addObject);
    }
    
    // Initialiseer de QR-scanner als de video element bestaat op deze pagina
    const qrVideoElement = document.getElementById('qr-video');
    if (qrVideoElement) {
        initializeQRScanner();
    }

    // Toon de initiele lijst van objecten
    displayObjects();
});

function initializeQRScanner() {
    let scanner = new Instascan.Scanner({ video: document.getElementById('qr-video') });

    scanner.addListener('scan', function (content) {
        console.log('QR Code gescand:', content);
        updateObjectStatus(content);
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('Geen camera’s gevonden.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

function addObject(e) {
    e.preventDefault();

    let titel = document.getElementById('titel').value;
    let omschrijving = document.getElementById('omschrijving').value;
    let datumIn = new Date().toISOString().split('T')[0];

    let newObject = {
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
    
    // Reset het formulier na het toevoegen van een object
    document.getElementById('objectForm').reset();
}

function updateObjectStatus(scannedId) {
    let id = parseInt(scannedId);
    let object = objectDatabase.find(obj => obj.id === id);

    if (object) {
        if (object.status === 'in') {
            object.status = 'uit';
            object.datumUit = new Date().toISOString().split('T')[0];
        } else {
            let newObject = {
                ...object,
                id: objectDatabase.length + 1,
                datumIn: new Date().toISOString().split('T')[0],
                datumUit: '',
                status: 'in'
            };
            objectDatabase.push(newObject);
        }
        saveToLocalStorage();
        displayObjects();
    } else {
        console.error('Object ID niet gevonden in de database:', id);
    }
}

function displayObjects() {
    // Voeg hier de code toe om objecten te tonen
    // Dit kan variëren afhankelijk van hoe je de lijst in je HTML weergeeft
}

function saveToLocalStorage() {
    localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
}

function loadFromLocalStorage() {
    let storedObjects = localStorage.getItem('objectDatabase');
    if (storedObjects) {
        objectDatabase = JSON.parse(storedObjects);
        displayObjects();
    }
}

// Voeg hier andere functies toe die je nodig hebt voor je app

