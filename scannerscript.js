let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
let isScanning = false;

function logMessage(message) {
    console.log(message);

    const logDiv = document.getElementById('logs');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    logDiv.appendChild(messageDiv);
}

function toggleScan() {
    if (isScanning) {
        scanner.stop();
        isScanning = false;
    } else {
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);  // Start de eerste beschikbare camera
                isScanning = true;
            } else {
                logMessage('Geen camera\'s gevonden.');
            }
        }).catch(function (e) {
            logMessage('Fout bij het ophalen van camera\'s: ' + e);
        });
    }
}

scanner.addListener('scan', function (content) {
    logMessage("QR-code succesvol gescand: " + content);
    handleScannedData(content);
    toggleScan();  // Stop na het scannen
});

function handleScannedData(data) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    let item = items.find(i => i.id === data);

    if (!item) {
        logMessage("Item niet gevonden!");
        return;
    }

    if (item.status === "available") {
        item.status = "borrowed";
        logMessage("Item is uitgeleend!");
    } else {
        item.status = "available";
        logMessage("Item is ingenomen!");
    }

    localStorage.setItem('items', JSON.stringify(items));
}

// Initialiseren van de items in localStorage (alleen de eerste keer)
if (!localStorage.getItem('items')) {
    let initialItems = [
        { id: "123456", status: "available" },
        { id: "789012", status: "available" }
    ];
    localStorage.setItem('items', JSON.stringify(initialItems));
}
