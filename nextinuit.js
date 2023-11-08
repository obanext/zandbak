// `nextinuit.js`
document.addEventListener('DOMContentLoaded', () => {
    // De QR-scanner moet alleen initialiseren op de pagina met de qr-video element
    if (document.getElementById('qr-video')) {
        initializeQRScanner();
    }
});

function initializeQRScanner() {
    let scanner = new Instascan.Scanner({ video: document.getElementById('qr-video') });
    scanner.addListener('scan', function (content) {
        console.log('QR Code gescand:', content);
        // Hier zou je de code plaatsen om de status van het object bij te werken
        // Dit vereist dat je ofwel toegang hebt tot de objectDatabase of een andere manier om de data op te halen
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('Geen camera’s gevonden.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}
