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
        startButton.click(); // Simuleer een klik op de start-knop
    });

  function startQRScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");
    const readerWidth = qrReaderElement.offsetWidth;
    const qrboxSize = Math.min(300, readerWidth);
    // Ensure the qrboxSize is at least 50px
    const correctedQrboxSize = Math.max(qrboxSize, 50);
    const config = {
        fps: 10,
        qrbox: { width: correctedQrboxSize, height: correctedQrboxSize }
    };

    // Corrected the start method parameters
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch((err) => {
            console.error(`Error in starting the QR scanner: ${err}`);
            
        });
}
    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code detected: ${decodedText}`);
        html5QrCode.stop().then(() => {
            console.log("QR scanning stopped after successful scan.");
            stopButton.click(); 
            const resultElement = document.getElementById('scan-result');
            const objectIndex = objectDatabase.findIndex(obj => obj.id === decodedText);
            if (objectIndex !== -1) {
                const object = objectDatabase[objectIndex];
                if (object.status === 'in') {
                    object.status = 'uit';
                    object.datumUit = new Date().toISOString().split('T')[0];
                    resultElement.textContent = `Enjoy: ${object.titel}`;
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
                    resultElement.textContent = `Thanks for returning: ${object.titel}`;
                }
                saveToLocalStorage();
            } else {
                resultElement.textContent = "We don't know this object. Scan again or contact staff";
            }
        }).catch((err) => {
            console.error(`Failed to stop QR scanner: ${err}`);
        });
    }

    function onScanFailure(error) {
        console.error(`QR scan error: ${error}`);
    }

    // Set initial visibility state
    qrReaderElement.style.display = 'none'; 
    placeholderImage.style.display = 'block'; 
});
