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
    let item = items.find(i => i.titel === data);

    if (!item) {
        logMessage("Item niet gevonden!");
        return;
    }

    if (item.status === "aanwezig") {
        item.status = "uitgeleend";
        logMessage(`${item.titel} is uitgeleend!`);
    } else {
        item.status = "aanwezig";
        logMessage(`${item.titel} is aanwezig!`);
    }

    localStorage.setItem('items', JSON.stringify(items));
}

function loadInitialFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('items', JSON.stringify(data));
                alert("Data geladen in localStorage!");
            } catch (error) {
                console.error('Fout bij het lezen van het initieel bestand:', error);
            }
        };

        reader.onerror = function(error) {
            console.error('Fout bij het lezen van het bestand:', error);
        };

        reader.readAsText(file);
    }
}

function resetItems() {
    localStorage.clear();
    location.reload();  // Refresh the page to reinitialize items
}

function saveBackup() {
    const backup = JSON.stringify(localStorage);
    localStorage.setItem('localStorageBackup', backup);
}

function restoreBackup() {
    const backup = localStorage.getItem('localStorageBackup');
    if (backup) {
        const data = JSON.parse(backup);
        for (let key in data) {
            localStorage.setItem(key, data[key]);
        }
        alert("localStorage hersteld vanuit backup!");
    } else {
        alert("Geen backup gevonden!");
    }
}

// Initialiseren van de items in localStorage (alleen de eerste keer)
if (!localStorage.getItem('items')) {
    let initialItems = [
        { titel: "alles gaat slapen", status: "aanwezig" },
        { titel: "natuur atlas", status: "aanwezig" },
        { titel: "1984", status: "aanwezig" },
        { titel: "kittens overal", status: "aanwezig" }
    ];
    localStorage.setItem('items', JSON.stringify(initialItems));
}
