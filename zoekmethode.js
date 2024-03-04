document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value;
    if (!searchTerm) {
        alert('Voer een zoekterm in.');
        return;
    }
    resetResults(); // Aanroepen van de resetResults functie om oude resultaten te wissen
    search(searchTerm);
});

function resetResults() {
    // Reset de inhoud van de resultaten containers
    document.getElementById('method-1').innerHTML = '';
    document.getElementById('method-2').innerHTML = '';
}

function search(searchTerm) {
    const types = ['book', 'ebook', 'dvdvideo', 'Activiteiten', 'website'];
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const apiKey = '16c19e6083308c984c452600134989ba';
    const baseUrl = 'https://zoeken.oba.nl/api/v1/search/?q=' + encodeURIComponent(searchTerm);
    const fetchPromises = [];

    types.forEach(type => {
        const url = type === 'Activiteiten'
            ? `${baseUrl}%20table:Activiteiten&refine=true&output=json&authorization=${apiKey}`
            : `${baseUrl}&facet=Type(${type})&refine=true&output=json&authorization=${apiKey}`;

        const fetchPromise = fetch(corsProxy + url)
            .then(response => response.json())
            .then(data => ({ data, type }));
        fetchPromises.push(fetchPromise);
    });

    Promise.all(fetchPromises).then(results => {
        results.forEach(({ data, type }) => displayResults(data, type, 1, searchTerm));
    });

    fetch(corsProxy + `${baseUrl}&refine=true&authorization=${apiKey}&output=json`)
        .then(response => response.json())
        .then(data => displayResults(data, 'all', 2, searchTerm));
}

function displayResults(data, type, method, searchTerm) {
    const typeMapping = {
        book: 'boek',
        ebook: 'ebook',
        dvdvideo: 'video',
        Activiteiten: 'activiteiten',
        website: 'oba.nl'
    };

    const containerId = method === 1 ? 'method-1' : 'method-2';
    const container = document.getElementById(containerId);

    if (method === 1 && type !== 'all') {
        const label = typeMapping[type] || type;
        const section = document.createElement('div');
        section.classList.add('results-section');
        const header = document.createElement('div');
        header.textContent = label;
        section.appendChild(header);

        if (data.results && data.results.length > 0) {
            data.results.slice(0, 5).forEach(result => {
                const link = document.createElement('a');
                link.href = result.detailLink;
                link.target = '_blank';
                const img = document.createElement('img');
                img.src = type === 'website' ? 'na.png' : (result.coverimages[1] || result.coverimages[0]);
                img.alt = 'Cover image';
                link.appendChild(img);
                section.appendChild(link);
            });
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = 'Geen resultaten gevonden.';
            section.appendChild(noResults);
        }

        const moreLink = document.createElement('a');
        moreLink.href = '#'; // Geen specifieke URL, omdat we de API-oproep direct vanuit JavaScript willen maken
        moreLink.textContent = 'Meer >';
        moreLink.classList.add('more-link');
        moreLink.addEventListener('click', function() {
            fetchMoreResults(type, searchTerm); // Fix: Call fetchMoreResults function
        });
        section.appendChild(moreLink);

        container.appendChild(section);
    } else if (method === 2 && type === 'all') {
        data.results.forEach(result => {
            const resultContainer = document.createElement('div');
            resultContainer.classList.add('result-item');

            const link = document.createElement('a');
            link.href = result.detailLink;
            link.target = '_blank';

            const img = document.createElement('img');
            img.src = type === 'website' ? 'na.png' : (result.coverimages[1] || result.coverimages[0]);
            img.alt = 'Cover image';
            link.appendChild(img);

            resultContainer.appendChild(link);

            if (result.summaries && result.summaries.length > 0) {
                const summary = document.createElement('p');
                summary.textContent = result.summaries[0];
                resultContainer.appendChild(summary);
            }

            container.appendChild(resultContainer);
        });
    }
}


function fetchMoreResults(type, searchTerm) {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const apiKey = '16c19e6083308c984c452600134989ba';
    const baseUrl = 'https://zoeken.oba.nl/api/v1/search/?q=' + encodeURIComponent(searchTerm);
    const url = type === 'Activiteiten'
        ? `${baseUrl}%20table:Activiteiten&refine=true&output=json&authorization=${apiKey}`
        : `${baseUrl}&facet=Type(${type})&refine=true&output=json&authorization=${apiKey}`;

    fetch(corsProxy + url)
        .then(response => response.json())
        .then(data => {
            // Opbouw en weergave van de extra resultaten
            const container = document.getElementById('method-1');
            container.innerHTML = ''; // Wis eerdere inhoud

            if (data.results && data.results.length > 0) {
                data.results.slice(0, 5).forEach(result => {
                    const resultContainer = document.createElement('div');
                    resultContainer.classList.add('result-item');

                    const link = document.createElement('a');
                    link.href = result.detailLink;
                    link.target = '_blank';

                    const img = document.createElement('img');
                    img.src = type === 'website' ? 'na.png' : (result.coverimages[1] || result.coverimages[0]);
                    img.alt = 'Cover image';
                    link.appendChild(img);

                    const summary = document.createElement('p');
                    summary.textContent = result.summaries && result.summaries.length > 0 ? result.summaries[0] : 'Geen samenvatting beschikbaar';

                    resultContainer.appendChild(link);
                    resultContainer.appendChild(summary);

                    container.appendChild(resultContainer);
                });
            } else {
                container.textContent = 'Geen resultaten gevonden.';
            }
        })
        .catch(error => console.error('Fout bij het ophalen van meer resultaten:', error));
}
