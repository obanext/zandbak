// nextinuit.js
// This script assumes the objectDatabase is already populated from the database.js script.

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
                stopButton.click(); // Simulate a click on the stop button
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });

            // Execute further actions after a successful scan
            // Adjusted to account for the new ID structure
            const scannedId = `${new_id_base}${String(decodedText).padStart(5, '0')}`;
            const objectIndex = objectDatabase.findIndex(obj => obj.id === scannedId);
            if (objectIndex !== -1) {
                const object = objectDatabase[objectIndex];
                // Toggle status between 'in' and 'uit'
                object.status = (object.status === 'in') ? 'uit' : 'in';
                object.datumUit = new Date().toISOString().split('T')[0];
                saveToLocalStorage();
                // Assuming displayObjects will be available and updated to show a confirmation message or update the UI.
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
