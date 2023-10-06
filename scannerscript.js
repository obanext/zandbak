let scanner = new Html5Qrcode("reader");
let isScanning = false;

function logMessage(message) {
    console.log(message); // Log naar console

    // Voeg bericht toe aan de pagina
    const logDiv = document.getElementById('logs');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    logDiv.appendChild(messageDiv);
}

function toggleScan() {
    if (isScanning) {
        stopScan();
    } else {
        startScan();
    }
}

function startScan() {
    scanner.start(
        { facingMode: "environment" },
        (decodedText, decodedResult) => {
            logMessage("QR-code succesvol gescand: " + decodedText);
            handleScannedData(decodedText);
            stopScan();
        },
        (errorMessage) => {
            logMessage("Fout tijdens het scannen: " + errorMessage);
        }
    ).catch(error => {
        logMessage("Fout bij het starten van de scanner: " + error);
    });
    isScanning = true;
}

function stopScan() {
    scanner.stop().then(() => {
        logMessage("Scan gestopt");
        isScanning = false;
    });
}

function handleScannedData(data) {
    logMessage("Gescande data: " + data);

    let items = JSON.parse(localStorage.getItem('items')) || [];
    logMessage("Items uit localStorage: " + JSON.stringify(items));

    let item = items.find(i => i.id === data);
    logMessage("Gevonden item: " + JSON.stringify(item));

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
