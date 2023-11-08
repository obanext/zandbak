document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('qr-reader')) {
        startQRScanner();
    }
});

function startQRScanner() {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // Deze functie wordt elke keer aangeroepen als er een QR-code wordt gescand.
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`QR Code detected: ${decodedText}`);
        // Voer hier de logica uit die je wilt uitvoeren na het scannen van de QR-code.
    };

    // Als er een fout optreedt (bijv. camera toestemmingen zijn geweigerd)
    const qrCodeErrorCallback = (errorMessage) => {
        // Dit wordt aangeroepen bij fouten.
        console.error(`QR Code no detected, error: ${errorMessage}`);
    };

    // Start met scannen van de camera.
    Html5Qrcode.getCameras().then((cameras) => {
        if (cameras && cameras.length) {
            html5QrCode.start(
                cameras[0].id, 
                config, 
                qrCodeSuccessCallback, 
                qrCodeErrorCallback
            ).catch((err) => {
                console.error(`Unable to start QR scanner, error: ${err}`);
            });
        }
    }).catch((err) => {
        console.error(`Unable to get cameras, error: ${err}`);
    });
}

// Zorg ervoor dat je de juiste ID hebt voor je videocontainer.
// In dit voorbeeld gebruiken we 'qr-reader' als ID voor de container waar de camera-invoer wordt getoond.
