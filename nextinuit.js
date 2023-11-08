// nextinuit.js

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const qrReaderElement = document.getElementById('qr-reader');
    let html5QrCode;

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        if (qrReaderElement) {
            startQRScanner();
        }
    });

    stopButton.addEventListener('click', function () {
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                console.log("QR scanning stopped.");
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });
        }
    });

    function startQRScanner() {
        html5QrCode = new Html5Qrcode("qr-reader");
        const readerWidth = qrReaderElement.offsetWidth;
        const qrboxSize = Math.min(300, readerWidth);
        const config = { fps: 10, qrbox: qrboxSize };

        function onScanSuccess(decodedText, decodedResult) {
            console.log(`QR code detected: ${decodedText}`);
            html5QrCode.stop().then(() => {
                console.log("QR scanning stopped after successful scan.");
                stopButton.click();
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });

            // Hier volgt de aangepaste logica voor het verwerken van de gescande QR-code
            const scannedId = decodedText;
            const objectIndex = objectDatabase.findIndex(obj => obj.id === scannedId && obj.status === 'in');

            if (objectIndex !== -1) {
                // Het object is aanwezig en de status is 'in', dus update naar 'uit'
                const object = objectDatabase[objectIndex];
                object.status = 'uit';
                object.datumUit = new Date().toISOString().split('T')[0];
                saveToLocalStorage();
            } else {
                // Als het object niet gevonden is of de status is 'uit', maak een nieuw 'in' record
                const originalObject = objectDatabase.find(obj => obj.id === scannedId);
                if (originalObject) {
                    const newObject = {
                        id: originalObject.id, // Gebruik hetzelfde ID
                        titel: originalObject.titel,
                        omschrijving: originalObject.omschrijving,
                        datumIn: new Date().toISOString().split('T')[0],
                        datumUit: '',
                        status: 'in'
                    };
                    objectDatabase.push(newObject);
                    saveToLocalStorage();
                } else {
                    console.error('Object ID not found in the database:', scannedId);
                }
            }
        }

        function onScanFailure(error) {
            console.error(`QR scan error: ${error}`);
        }

        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .catch((err) => {
                console.error(`Error in starting the QR scanner: ${err}`);
            });
    }
});
