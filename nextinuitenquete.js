const enqueteDatabase = JSON.parse(localStorage.getItem('enqueteDatabase')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayEnquetes();
    document.getElementById('enqueteForm').addEventListener('submit', addEnquete);
    document.getElementById('csvFileInput').addEventListener('change', importCsv);
});

function addEnquete(e) {
    e.preventDefault();
    const lidVanOBA = document.querySelector('input[name="lid-van-oba"]:checked').value;
    const meningOverLenen = document.getElementById('mening-over-lenen').value;
    const toekomstigLid = document.getElementById('toekomstig-lid').value;
    const newEnquete = {
        id: enqueteDatabase.length + 1,
        lidVanOBA,
        meningOverLenen,
        toekomstigLid
    };
    enqueteDatabase.push(newEnquete);
    saveToLocalStorage();
    displayEnquetes();
    e.target.reset();
}

function displayEnquetes() {
    const listContainer = document.getElementById('enquete-lijst');
    listContainer.innerHTML = '';
    enqueteDatabase.forEach(enquete => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'enquete-item';
        itemDiv.style.fontFamily = "'AvenirLight', 'Arial', sans-serif"; // Deze regel voegt de font-family stijl toe
        itemDiv.textContent = `ID: ${enquete.id}, Lid: ${enquete.lidVanOBA}, Mening: ${enquete.meningOverLenen}, Toekomstig lid: ${enquete.toekomstigLid}`;
        listContainer.appendChild(itemDiv);
    });
}

function importCsv(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            const csvData = event.target.result;
            const newData = parseCsv(csvData);

            
            enqueteDatabase.length = 0;
            
            enqueteDatabase.push(...newData);
            saveToLocalStorage();
            displayEnquetes();
        };
    } else {
        alert('Geen bestand geselecteerd');
    }
}


function parseCsv(data) {
    const csvRows = data.split(/\r\n|\n/);
    const headers = csvRows[0].split(',');
    return csvRows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((enquete, header, index) => {
            enquete[header] = values[index];
            return enquete;
        }, {});
    });
}

function downloadObjectAsCsv(objArray, filename) {
    const csvStr = convertToCSV(objArray);
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
}

function convertToCSV(objArray) {
    if (objArray.length === 0) return '';
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const headers = Object.keys(array[0]);
    const csvRows = array.map(row =>
        headers.map(header => `"${row[header]}"`).join(',')
    );
    return [headers.join(','), ...csvRows].join('\r\n');
}

function saveToLocalStorage() {
    localStorage.setItem('enqueteDatabase', JSON.stringify(enqueteDatabase));
}

document.getElementById('download-csv').addEventListener('click', () => {
    const filename = `enquete${new Date().toISOString().slice(0,19).replace(/:/g, '-')}`;
    downloadObjectAsCsv(enqueteDatabase, filename);
});
