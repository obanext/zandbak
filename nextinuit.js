
document.addEventListener('DOMContentLoaded', () => {
    // Zorg ervoor dat dit element bestaat in je HTML
    const qrCodeRegion = document.getElementById('qr-reader');
    if (qrCodeRegion) {
        startQRScanner();
    }
});

function startQRScanner() {
    // Maak een nieuwe instance van Html5QrcodeScanner
    const html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    function onScanSuccess(decodedText, decodedResult) {
        // Behandel de gedecodeerde tekst zoals nodig voor je applicatie
        console.log(`QR code gedetecteerd: ${decodedText}`);
        
        // Stop QR Code scanning als je wilt dat het na één scan stopt.
        html5QrCode.stop().then((ignore) => {
          // QR Scanning is gestopt.
        }).catch((err) => {
          // Stoppen is mislukt, mogelijk vanwege een fout
          console.warn('Fout bij het stoppen van QR scanning.', err);
        });
    }

    // Start met het scannen van QR-codes. De camera wordt gestart en begint met scannen.
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
        .catch((err) => {
            // Foutmeldingen als de camera niet gevonden of gestart kan worden.
            console.error(`Fout bij het starten van de QR-scanner: ${err}`);
        });
}
