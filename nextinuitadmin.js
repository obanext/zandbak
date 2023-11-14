function importCSVAndGenerateQR() {
    const fileInput = document.getElementById('csvFileInput');
    if (!fileInput) {
        console.error('CSV file input element not found');
        return;
    }

    fileInput.click(); // Open the file dialog

    fileInput.onchange = e => {
        let busyIndicator = document.getElementById('busyIndicator');
        if (!busyIndicator) {
            busyIndicator = document.createElement('div');
            busyIndicator.id = 'busyIndicator';
            busyIndicator.innerText = 'Bezig...'; // Dutch for 'Busy...'
            document.body.appendChild(busyIndicator);
        }
        busyIndicator.style.display = 'block';

        let file = e.target.files[0];
        Papa.parse(file, {
            complete: function(results) {
                let csvResults = results.data; // Tijdelijke variabele om de CSV-resultaten op te slaan
                let processedCount = 0; // To keep track of how many QR codes have been processed

                csvResults.forEach((row, index) => {
                    if (index === 0) { return; } // Skip the header row
                    if (row.length > 0 && row[0].trim() !== '') {
                        try {
                            // Generate QR Code for each row using qrcode-generator
                            let qr = qrcode(0, 'L');
                            qr.addData(row[0]);
                            qr.make();
                            let imgTag = qr.createImgTag(4); // Creates an <img> tag as a string

                            // Convert image tag to a downloadable image
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
                                    let filename = 'QR_' + Date.now() + '_' + index + '.png';
                                    let link = document.createElement('a');
                                    link.download = filename;
                                    link.href = URL.createObjectURL(blob);
                                    link.click();
                                    // Update de verwerkings teller
                                    processedCount++;
                                    if (processedCount === csvResults.length - 1) { // -1 omdat we de header overslaan
                                        busyIndicator.style.display = 'none';
                                    }
                                });
                            };
                            image.src = imgElement.src;
                        } catch (error) {
                            console.error('Error generating QR code for row: ', row, error);
                        }
                    } else {
                        // Update de verwerkings teller
                        processedCount++;
                    }

                    // Controleer of alle QR-codes zijn verwerkt
                    if (processedCount === csvResults.length - 1) { // -1 omdat we de header overslaan
                        busyIndicator.style.display = 'none';
                    }
                });

                // Verberg de bezig-indicator na verwerking
                if (processedCount === csvResults.length - 1) { // -1 omdat we de header overslaan
                    busyIndicator.style.display = 'none';
                }
            },
            error: function(err) {
                console.error('Error parsing CSV: ', err);
                busyIndicator.style.display = 'none';
            }
        });
    };
}
