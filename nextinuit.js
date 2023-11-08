document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const qrReaderElement = document.getElementById('qr-reader');
    let html5QrCode;

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        if (qrReaderElement) {
            startQRScanner();
        }
    });

    stopButton.addEventListener('click', () => {
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
                stopButton.click(); // Simulate a click on the stop button
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });

            // Execute further actions after a successful scan
            const scannedId = parseInt(decodedText);
            // Assuming objectDatabase is available in this scope:
            const objectIndex = objectDatabase.findIndex(obj => obj.id === scannedId);
            if (objectIndex !== -1) {
                const object = objectDatabase[objectIndex];
                if (object.status === 'in') {
                    object.status = 'uit';
                    object.datumUit = new Date().toISOString().split('T')[0];
                } else if (object.status === 'uit') {
                    const newObject = {...object, id: objectDatabase.length + 1, datumIn: new Date().toISOString().split('T')[0], datumUit: '', status: 'in'};
                    objectDatabase.push(newObject);
                }
                saveToLocalStorage();
                displayObjects();
            } else {
                console.error('Object ID not found in the database:', scannedId);
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
