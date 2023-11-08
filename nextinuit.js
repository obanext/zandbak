document.addEventListener('DOMContentLoaded', () => {
    const qrReaderElement = document.getElementById('qr-reader');
    if (qrReaderElement) {
        startQRScanner();
    }
});

function startQRScanner() {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code gedetecteerd: ${decodedText}`);
        // Doe iets met de gedecodeerde tekst, zoals het bijwerken van de status van een object.
        // Je kunt ervoor kiezen om de scanner te stoppen of door te laten scannen.
        // html5QrCode.stop(); // Uncomment deze lijn om de scanner te stoppen.
    }

    function onScanFailure(error) {
        // Log errors, maar spam niet de console als er gewoon geen QR code gevonden wordt.
        console.error(`QR scanfout: ${error}`);
    }

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch((err) => {
            console.error(`Fout bij het starten van de QR scanner: ${err}`);
        });
}
