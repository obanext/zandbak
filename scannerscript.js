let scanner = new Html5Qrcode("reader");

function startScan() {
    scanner.start(
        { facingMode: "environment" },
        (decodedText, decodedResult) => {
            console.log("QR-code succesvol gescand:", decodedText);
            handleScannedData(decodedText);
            stopScan();  // Stop de scanner na het scannen van een QR-code
        },
        (errorMessage) => {
            console.error("Fout tijdens het scannen:", errorMessage);
        }
    ).catch(error => {
        console.error("Fout bij het starten van de scanner:", error);
    });
}

function stopScan() {
    scanner.stop().then(() => {
        console.log("Scan gestopt");
    });
}

function handleScannedData(data) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    let item = items.find(i => i.id === data);

    if (!item) {
        alert("Item niet gevonden!");
        return;
    }

    if (item.status === "available") {
        item.status = "borrowed";
        alert("Item is uitgeleend!");
    } else {
        item.status = "available";
        alert("Item is ingenomen!");
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
