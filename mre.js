document.addEventListener('DOMContentLoaded', () => {
    const qrReaderElement = document.getElementById('qr-reader');
    let html5QrCode;

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code detected: ${decodedText}`);
        html5QrCode.stop();
    }

    function onScanFailure(error) {
        console.error(`QR scan error: ${error}`);
    }

    function startQRScanner() {
        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .catch((err) => {
                console.error(`Error in starting the QR scanner: ${err}`);
            });
    }

    startQRScanner(); // Start scanner on load for MRE
});
