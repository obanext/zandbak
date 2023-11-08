document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('qr-reader')) {
        startQRScanner();
    }
});

function startQRScanner() {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`QR code gedetecteerd: ${decodedText}`);
        // Verwerk qrCode.data hier, bijvoorbeeld om de status van een object bij te werken
        // Optioneel: stop de QR-code scanner als je wilt dat hij na één scan stopt
        html5QrCode.stop();
    }

    function onScanFailure(error) {
        // Dit wordt aangeroepen bij elke scanpoging als er geen QR code is gevonden.
        // Dit is een goede plek om een foutmelding of waarschuwing aan de gebruiker te tonen.
    }

    // Start de camera en begin met het scannen van QR-codes
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch((err) => {
            // Foutmeldingen als de camera niet gevonden of gestart kan worden.
            console.error(`Fout bij het starten van de QR-scanner: ${err}`);
        });
}
