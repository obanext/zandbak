let scanner = new Instascan.Scanner({ video: document.getElementById('qr-reader') });

scanner.addListener('scan', function (content) {
  console.log('QR Code content:', content);
  // Stop scanning once the code is scanned
  scanner.stop();
  document.getElementById('stop-button').style.display = 'none';
  document.getElementById('start-button').style.display = 'block';
});

document.getElementById('start-button').addEventListener('click', function () {
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
      document.getElementById('start-button').style.display = 'none';
      document.getElementById('stop-button').style.display = 'block';
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error('Error initializing cameras', e);
  });
});

document.getElementById('stop-button').addEventListener('click', function () {
  scanner.stop();
  document.getElementById('stop-button').style.display = 'none';
  document.getElementById('start-button').style.display = 'block';
});
