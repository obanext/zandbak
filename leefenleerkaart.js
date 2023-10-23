document.addEventListener('DOMContentLoaded', function () {
    // Selecteer alle relevante checkboxes
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    
    // Basis URL voor de kaart
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    // Referentie naar de iframe
    var iframe = document.getElementById('map');

    // Selecteer de "Alle gebieden" checkbox
    var allAreasCheckbox = document.querySelector('#all-areas');

    // Functie die de initiële kaart laadt met alle gebieden geselecteerd
    function loadInitialMap() {
        var allAreasUrl = baseUrl;
        var allGeonamen = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad']; // Alle gebieden

        allGeonamen.forEach(function(geonaam) {
            allAreasUrl += '&activate|geonaam=' + geonaam + '&activate|selector=' + geonaam;
        });

        iframe.src = allAreasUrl; // Dit stelt de URL van de iframe in op alle gebieden
    }

    // Voeg event listeners toe aan alle checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap(); // Update de kaart bij elke verandering
        });
    });

    // Event listener voor de "Alle gebieden" checkbox
    allAreasCheckbox.addEventListener('change', function () {
        if (this.checked) {
            loadInitialMap();
        } else {
            updateMap();
        }
    });

    // Functie die de kaart update op basis van de geselecteerde opties
    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl; // We beginnen met de basis URL

        // Verzamelen van alle geselecteerde geonamen, activiteiten, en opties
        var geonamen = Array.from(geonaamCheckboxes, checkbox => checkbox.value);
        var activiteiten = Array.from(activiteitCheckboxes, checkbox => checkbox.value);
        var taalOpties = Array.from(taalOptiesCheckboxes, checkbox => checkbox.value);
        var digitaalOpties = Array.from(digitaalOptiesCheckboxes, checkbox => checkbox.value);

        // Als "Alle gebieden" niet is geselecteerd, volg dan de normale update logica
        if (!allAreasCheckbox.checked) {
            geonamen.forEach(function (geonaam) {
                newUrl += '&activate|geonaam=' + geonaam;

                // Als er geen activiteit is geselecteerd, gebruik dan alleen de geonaam als selector
                if (activiteiten.length === 0) {
                    newUrl += '&activate|selector=' + geonaam;
                } else {
                    // Als er activiteiten zijn, voeg dan voor elke activiteit een selector toe
                    activiteiten.forEach(function (activiteit) {
                        var opties = (activiteit === 't') ? taalOpties : digitaalOpties;

                        // Als er geen specifieke opties zijn geselecteerd, gebruik dan de activiteit
                        if (opties.length === 0) {
                            newUrl += '&activate|selector=' + geonaam + activiteit;
                        } else {
                            // Voeg voor elke optie een aparte selector toe
                            opties.forEach(function (optie) {
                                newUrl += '&activate|selector=' + geonaam + activiteit + optie;
                            });
                        }
                    });
                }
            });
        }

        // Update de iframe URL met de nieuwe URL
        iframe.src = newUrl;
    }

    // Laad de initiële kaart wanneer de pagina wordt geladen
    loadInitialMap();
});
