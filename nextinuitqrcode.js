function generateQRForSearchResults() {
    const searchResults = performSearch();
    searchResults.forEach(object => {
        downloadQRCode(object.id, `QR_${object.id}.png`);
    });
}

function downloadQRCode(data) {
    let imgTag = generateQRCode(data);
    if (!imgTag) return;

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = imgTag;
    let imgElement = tempDiv.firstChild;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let image = new Image();

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        canvas.toBlob(function(blob) {
            const filename = `${data}.png`; 
            let link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
        });
    };
    image.src = imgElement.src;
}


function generateQRCode(data) {
    try {
        let qr = qrcode(0, 'L');
        qr.addData(data);
        qr.make();
        return qr.createImgTag(4);
    } catch (error) {
        console.error('Error generating QR code: ', error);
        return null;
    }
}
