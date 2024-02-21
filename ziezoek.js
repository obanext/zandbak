document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value;
    if (!searchTerm) {
        alert('Voer een zoekterm in.');
        return;
    }

    search(searchTerm);
});

function search(searchTerm) {
    const types = ['book', 'ebook', 'dvdvideo', 'website', 'activity'];
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'; // Voorbeeld CORS Proxy
    const apiKey = '16c19e6083308c984c452600134989ba';
    const baseUrl = 'https://zoeken.oba.nl/api/v1/search/?q=' + encodeURIComponent(searchTerm);

    types.forEach(type => {
        let url = `${baseUrl}&facet=Type(${type})&refine=true&output=json&authorization=${apiKey}`;
        if (type === 'activity') {
            url = `${baseUrl}%20table:jsonsrc&refine=true&output=json&authorization=${apiKey}`;
        }

        fetch(corsProxy + url)
            .then(response => response.json())
            .then(data => displayResults(data, type, 1));
    });

    // Methode 2: Alle resultaten
    fetch(corsProxy + `${baseUrl}&refine=true&authorization=${apiKey}&output=json`)
        .then(response => response.json())
        .then(data => displayResults(data, 'all', 2));
}

function displayResults(data, type, method) {
    const containerId = method === 1 ? 'method-1' : 'method-2';
    const container = document.getElementById(containerId);

    if (method === 1) {
        const header = document.createElement('h3');
        header.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        container.appendChild(header);
    }

    data.results.forEach((result, index) => {
        if (index < 5) {
            const img = document.createElement('img');
            img.src = result.coverimages[1] || result.coverimages[0];
            container.appendChild(img);
        }
    });

    if (method === 1 && data.results.length > 0) {
        const moreLink = document.createElement('a');
        moreLink.href = `https://zoeken.oba.nl/?q=${encodeURIComponent(searchTerm)}&dim=Type(${type})`;
        moreLink.textContent = 'Meer >';
        moreLink.target = '_blank';
        container.appendChild(moreLink);
    }
}
