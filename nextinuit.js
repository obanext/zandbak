document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const qrReaderElement = document.getElementById('qr-reader');
    const resultElement = document.getElementById('scan-result'); // Veronderstelt dat dit element bestaat in uw HTML.
    let html5QrCode;

    // Placeholder image element
    const placeholderImage = document.createElement('img');
    placeholderImage.id = 'placeholder-image';
    placeholderImage.src = 'nextxbb.png';
    placeholderImage.alt = 'Start Scanner';
    placeholderImage.style.cursor = 'pointer';
    placeholderImage.style.display = 'block';
    qrReaderElement.parentNode.insertBefore(placeholderImage, qrReaderElement);

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        qrReaderElement.style.display = 'block';
        placeholderImage.style.display = 'none';
        if (qrReaderElement) {
            startQRScanner();
        }
    });

    stopButton.addEventListener('click', function () {
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    qrReaderElement.style.display = 'none';
    placeholderImage.style.display = 'block';
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("QR scanning stopped.");
        }).catch((err) => {
            console.error(`Failed to stop QR scanner: ${err}`);
        });
    }
});

    placeholderImage.addEventListener('click', function () {
        startButton.click();
    });

   // ... [de rest van je code voor deze sectie]

function startQRScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");
    const readerWidth = qrReaderElement.offsetWidth;
    const qrboxSize = Math.min(300, readerWidth);
    const correctedQrboxSize = Math.max(qrboxSize, 150);
    html5QrCode.start({ facingMode: "environment" }, {
        fps: 10,
        qrbox: { width: correctedQrboxSize, height: correctedQrboxSize }
    }, onScanSuccess, onScanFailure)
    .catch((err) => {
        console.error(`Error in starting the QR scanner: ${err}`);
    });
}



    // De eerder verstrekte onScanSuccess en onScanFailure functies zijn hier geïntegreerd.
    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code detected: ${decodedText}`);
        html5QrCode.stop().then(() => {
            console.log("QR scanning stopped after successful scan.");
            stopButton.click();

            // Aangenomen dat objectDatabase en saveToLocalStorage beschikbaar zijn in de scope.
            const objectIndices = objectDatabase
                .map((obj, index) => ({ id: obj.id, index }))
                .filter(obj => obj.id === decodedText)
                .map(obj => obj.index);

            const lastObjectIndex = objectIndices.length > 0 ? objectIndices[objectIndices.length - 1] : -1;

            if (lastObjectIndex !== -1) {
                const object = objectDatabase[lastObjectIndex];
                if (object.status === 'in') {
                    object.status = 'uit';
                    object.datumUit = new Date().toISOString().split('T')[0];
                    resultElement.textContent = `je hebt: "${object.titel}" geleend`;
                } else {
                    const newObject = {
                        id: object.id,
                        titel: object.titel,
                        omschrijving: object.omschrijving,
                        datumIn: new Date().toISOString().split('T')[0],
                        datumUit: '',
                        status: 'in'
                    };
                    objectDatabase.push(newObject);
                    resultElement.textContent = `Dank voor het terugbrengen van: "${object.titel}"`;
                }
                saveToLocalStorage();
            } else {
                resultElement.textContent = "We weten niet wat dit is. Scan nog een keer of vraag het even";
            }
        }).catch((err) => {
            console.error(`Failed to stop QR scanner: ${err}`);
        });
    }

    function onScanFailure(error) {
        console.error(`QR scan error: ${error}`);
    }

    // Zorg dat deze elementen opnieuw worden getoond als er geen scan plaatsvindt.
    qrReaderElement.style.display = 'none';
    placeholderImage.style.display = 'block';
});
