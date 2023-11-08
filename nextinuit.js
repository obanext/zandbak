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
        const scannedId = parseInt(decodedText);
        // Aannemende dat objectDatabase beschikbaar is in deze scope:
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
            console.error('Object ID niet gevonden in de database:', scannedId);
        }
    }
    
    function onScanFailure(error) {
        console.error(`QR scanfout: ${error}`);
    }
    
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch((err) => {
            console.error(`Fout bij het starten van de QR scanner: ${err}`);
        });
}
