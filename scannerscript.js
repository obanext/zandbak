const codeReader = new ZXing.BrowserQRCodeReader();
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
        codeReader.reset();
        isScanning = false;
    } else {
        codeReader.decodeFromVideoDevice(null, 'preview', (result, err) => {
            if (result) {
                logMessage(`QR-code succesvol gescand: ${result.text}`);
                handleScannedData(result.text);
                toggleScan();  // Stop na het scannen
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                logMessage(`Fout tijdens het scannen: ${err}`);
            }
        });
        isScanning = true;
    }
}

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
