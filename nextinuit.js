// `nextinuit.js`
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('qr-video')) {
        startVideoStream();
    }
});

function startVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            const video = document.getElementById('qr-video');
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // vereist om te zeggen tegen iOS safari dat we geen fullscreen willen
            video.play();
            requestAnimationFrame(scanQRCode);
        })
        .catch(function(err) {
            console.error("Error accessing the camera", err);
        });
}

function scanQRCode() {
    const video = document.getElementById('qr-video');
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (qrCode) {
            console.log("Gevonden QR code", qrCode.data);
            // Verwerk qrCode.data hier, bijvoorbeeld om de status van een object bij te werken
        }
    }
    requestAnimationFrame(scanQRCode); // Blijf frames scannen
}
