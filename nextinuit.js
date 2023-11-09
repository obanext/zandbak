document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const qrReaderElement = document.getElementById('qr-reader');
    let html5QrCode;

    // Placeholder image element
    const placeholderImage = document.createElement('img');
    placeholderImage.id = 'placeholder-image';
    placeholderImage.src = 'nextxbb.png'; 
    placeholderImage.alt = 'Start Scanner';
    placeholderImage.style.cursor = 'pointer';
    placeholderImage.style.display = 'block'; // Show by default
    qrReaderElement.parentNode.insertBefore(placeholderImage, qrReaderElement);

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        qrReaderElement.style.display = 'block';
        placeholderImage.style.display = 'none'; // Verberg de placeholder afbeelding
        if (qrReaderElement) {
            startQRScanner();
        }
    });

    stopButton.addEventListener('click', function () {
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
        qrReaderElement.style.display = 'none';
        placeholderImage.style.display = 'block'; // Toon de placeholder afbeelding
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                console.log("QR scanning stopped.");
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });
        }
    });

    placeholderImage.addEventListener('click', function () {
        startButton.click(); // Simuleer een klik op de start-knop
    });

    function startQRScanner() {
        html5QrCode = new Html5Qrcode("qr-reader");
        const readerWidth = qrReaderElement.offsetWidth;
        const qrboxSize = Math.min(300, readerWidth);
        const config = { fps: 10, qrbox: qrboxSize };

        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .catch((err) => {
                console.error(`Error in starting the QR scanner: ${err}`);
            });
    }

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code detected: ${decodedText}`);
        html5QrCode.stop().then(() => {
            console.log("QR scanning stopped after successful scan.");
            stopButton.click(); // Simuleer een klik op de stop-knop
        }).catch((err) => {
            console.error(`Failed to stop QR scanner: ${err}`);
        });

        // Behandeling van de gescande QR code
        const scannedId = decodedText;
        const objectIndex = objectDatabase.findIndex(obj => obj.id === scannedId && obj.status === 'in');
        if (objectIndex !== -1) {
            const object = objectDatabase[objectIndex];
            object.status = 'uit';
            object.datumUit = new Date().toISOString().split('T')[0];
            saveToLocalStorage();
        } else {
            const originalObject = objectDatabase.find(obj => obj.id === scannedId);
            if (originalObject) {
                const newObject = {
                    id: originalObject.id,
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

    // Set initial visibility state
    qrReaderElement.style.display = 'none'; // Verberg de QR-reader element
    placeholderImage.style.display = 'block'; // Toon de placeholder afbeelding
});
