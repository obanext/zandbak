document.addEventListener('DOMContentLoaded', function() {
    // Definities
    const mapFrame = document.getElementById('mapFrame');
    const geonaamCheckboxes = document.querySelectorAll('.geonaam');
    const activiteitCheckboxes = document.querySelectorAll('.activiteit');
    const taalCheckboxes = document.querySelectorAll('.taal-opties input');
    const digitaalCheckboxes = document.querySelectorAll('.digitaal-opties input');
    const taalOptiesDiv = document.querySelector('.taal-opties');
    const digitaalOptiesDiv = document.querySelector('.digitaal-opties');

    // Helperfunctie om de URL te bouwen
    function buildUrl() {
        let baseUrl = "https://localfocuswidgets.net/65367ce7b3c77?hide=dropdowns";
        let geonaamParams = [];
        let selectorParams = [];

        // Verzamel parameters van geselecteerde checkboxes
        geonaamCheckboxes.forEach((checkbox) => {
            const geonaamValue = checkbox.dataset.geonaam;
            geonaamParams.push(`&activate|geonaam=${geonaamValue}`);
        });

        activiteitCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                const activiteitValue = checkbox.dataset.activiteit;
                selectorParams.push(activiteitValue); // Bewaar voor nu de activiteitwaarden
            }
        });

        // Houd rekening met taal- of digitaalopties
        taalCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                const taalValue = checkbox.dataset.activiteit;
                selectorParams = selectorParams.map(value => {
                    if (value === 't') {
                        return value + taalValue; // Combineer taalactiviteit met taalniveau
                    }
                    return value;
                });
            }
        });

        digitaalCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                const digitaalValue = checkbox.dataset.activiteit;
                selectorParams = selectorParams.map(value => {
                    if (value === 'd') {
                        return value + digitaalValue; // Combineer digitale activiteit met niveau
                    }
                    return value;
                });
            }
        });

        // Nu bouwen we de volledige selector parameters op basis van de geonaam en verzamelde activiteiten
        let fullSelectorParams = [];
        geonaamCheckboxes.forEach((checkbox) => {
            const geonaamValue = checkbox.dataset.geonaam;
            selectorParams.forEach((selectorValue) => {
                fullSelectorParams.push(`&activate|selector=${geonaamValue}${selectorValue}`);
            });
        });

        // Combineer parameters met de basis-URL
        return baseUrl + geonaamParams.join('') + fullSelectorParams.join('');
    }

    // Functie om de kaart bij te werken
    function updateMap() {
        const url = buildUrl();
        mapFrame.src = url;
    }

    // Functie om de zichtbaarheid van opties te beheren
    function manageOptionsVisibility() {
        let isTaalSelected = Array.from(activiteitCheckboxes).some(checkbox => checkbox.checked && checkbox.dataset.activiteit === 't');
        let isDigitaalSelected = Array.from(activiteitCheckboxes).some(checkbox => checkbox.checked && checkbox.dataset.activiteit === 'd');
        taalOptiesDiv.style.display = isTaalSelected ? 'block' : 'none';
        digitaalOptiesDiv.style.display = isDigitaalSelected ? 'block' : 'none';
    }

    // Event listeners op checkboxes
    geonaamCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            updateMap();
        });
    });

    activiteitCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            manageOptionsVisibility();
            updateMap();
        });
    });

    taalCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            updateMap();
        });
    });

    digitaalCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            updateMap();
        });
    });

    // Initiële kaartinstelling
    manageOptionsVisibility();
    updateMap();
});
