document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const qrReaderElement = document.getElementById('qr-reader');
    let html5QrCode;

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        startQRScanner();
    });

    stopButton.addEventListener('click', () => {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                console.log("QR scanning stopped.");
                startButton.style.display = 'block';
                stopButton.style.display = 'none';
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });
        }
    });

    function startQRScanner() {
        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        function onScanSuccess(decodedText, decodedResult) {
            console.log(`QR code detected: ${decodedText}`);
            html5QrCode.stop().then(() => {
                console.log("QR scanning stopped after successful scan.");
                stopButton.click();
            }).catch((err) => {
                console.error(`Failed to stop QR scanner: ${err}`);
            });
        }
        
        function onScanFailure(error) {
            // Consider logging to the console for real-time feedback
            console.error(`QR scan error: ${error}`);
        }
        
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .catch((err) => {
                console.error(`Error in starting the QR scanner: ${err}`);
            });
    }
});
