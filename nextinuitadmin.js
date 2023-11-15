	const new_id_base = 'nextinuit00000';
	let lastChecked = null; 

	document.addEventListener('DOMContentLoaded', () => {
		displayObjects();
		document.getElementById('objectForm').addEventListener('submit', addObject);
		document.getElementById('csvFileInput').addEventListener('change', importCsv);
		document.getElementById('search-button').addEventListener('click', performSearch);
		document.getElementById('clear-button').addEventListener('click', clearSearch);
		document.getElementById('generate-qr-button').addEventListener('click', generateQRForSearchResults);
		document.getElementById('export-csv-button').addEventListener('click', () => {
			downloadObjectAsCsv(objectDatabase);
		});
		loadFromLocalStorage();

		
		const statusIn = document.getElementById('status-in');
		const statusUit = document.getElementById('status-uit');
		[statusIn, statusUit].forEach(radio => {
			radio.addEventListener('click', function() {
				if (this === lastChecked) {
					this.checked = false;
					lastChecked = null;
				} else {
					lastChecked = this;
				}
			});
		});
	});


	function addObject(e) {
		e.preventDefault();
		const titel = document.getElementById('titel').value;
		const new_id = `${new_id_base}${String(objectDatabase.length + 1).padStart(5, '0')}`;
		const datumIn = new Date().toISOString().split('T')[0];
		const newObject = {
			id: new_id,
			titel: titel,
			datumIn: datumIn,
			datumUit: '',
			status: 'in'
		};
		objectDatabase.push(newObject);
		saveToLocalStorage();
		displayObjects();
		e.target.reset();
		downloadQRCode(new_id, `QR_${new_id}.png`);
	}

	function displayObjects(objects = objectDatabase) {
		const listContainer = document.querySelector('.object-list-container');
		listContainer.innerHTML = '';
		objects.forEach(obj => {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'object-item';
			itemDiv.style.fontFamily = "'AvenirLight', 'Arial', sans-serif";
			itemDiv.textContent = `ID: ${obj.id} Titel: ${obj.titel} Datum In: ${obj.datumIn} Datum Uit: ${obj.datumUit} Status: ${obj.status}`;
			listContainer.appendChild(itemDiv);
		});
	}


	function performSearch() {
		const searchId = document.getElementById('search-id').value.trim();
		const searchTitle = document.getElementById('search-title').value.trim().toLowerCase();
		const statusIn = document.getElementById('status-in').checked;
		const statusUit = document.getElementById('status-uit').checked;

		let results = [...objectDatabase];
		if (searchId) {
			results = results.filter(obj => obj.id.includes(searchId));
		}
		if (searchTitle) {
		   
			results = results.filter(obj => obj.titel && obj.titel.toLowerCase().includes(searchTitle));
		}
		if (statusIn) {
			results = results.filter(obj => obj.status === 'in');
		} else if (statusUit) {
			results = results.filter(obj => obj.status === 'uit');
		}
		
		displayObjects(results);
		return results;
	}




	function clearSearch() {
		document.getElementById('search-id').value = '';
		document.getElementById('search-title').value = '';
		document.getElementById('status-in').checked = false;
		document.getElementById('status-uit').checked = false;
		displayObjects();
	}

	function saveToLocalStorage() {
		localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
	}

	function loadFromLocalStorage() {
		const storedObjects = localStorage.getItem('objectDatabase');
		objectDatabase = storedObjects ? JSON.parse(storedObjects) : [];
	}

	function importCsv(e) {
		const file = e.target.files[0];
		if (file) {
			Papa.parse(file, {
				complete: function(results) {
					objectDatabase = results.data.map(row => ({
						id: row[0],
						titel: row[1],
						datumIn: row[2],
						datumUit: row[3],
						status: row[4]
					}));
					saveToLocalStorage();
					displayObjects();
				}
			});
		}
	}
	function downloadObjectAsCsv(objects) {
    console.log("downloadObjectAsCsv is aangeroepen"); 

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '');
    const filename = `inuitobjecten_${formattedDate}_${formattedTime}.csv`;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Titel,Datum In,Datum Uit,Status\n"; 
    
    objects.forEach(obj => {
        const row = `${obj.id},${obj.titel},${obj.datumIn},${obj.datumUit},${obj.status}`;
        csvContent += row + "\r\n";
    });

    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


document.getElementById('export-csv-button').removeEventListener('click', handleExportCSVClick);

function handleExportCSVClick() {
    console.log("Knop 'export CSV' is geklikt"); 
    downloadObjectAsCsv(objectDatabase);
}

document.getElementById('export-csv-button').addEventListener('click', handleExportCSVClick);

