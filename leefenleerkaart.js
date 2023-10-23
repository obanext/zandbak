document.addEventListener('DOMContentLoaded', function () {
    // Selecteer alle relevante checkboxes
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    
    // Basis URL voor de kaart
    var baseUrl = 'https://localfocuswidgets.net/65365e9f122eb?hide=dropdowns';

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
    document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.getElementById('all-areas'); // Selecteer de "Alle gebieden" checkbox
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    function loadInitialMap() {
        var initialUrl = baseUrl + '&activate|selector=aa'; // De selector voor "alle gebieden"
        iframe.src = initialUrl;
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    allAreasCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Als "Alle gebieden" is geselecteerd, deselecteer dan andere geonamen
            var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input');
            geonaamCheckboxes.forEach(function(checkbox) {
                if (checkbox !== allAreasCheckbox) { // Zorg ervoor dat we "Alle gebieden" niet deselecteren
                    checkbox.checked = false;
                }
            });
        }
        updateMap(); // Update de kaart bij wijzigingen
    });

    function updateMap() {
        var allAreasSelected = allAreasCheckbox.checked;
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl;

        if (allAreasSelected) {
            // Bouw de URL op voor alle gebieden
            newUrl += '&activate|geonaam=ac&activate|selector=ac';
            newUrl += '&activate|geonaam=an&activate|selector=an';
            newUrl += '&activate|geonaam=az&activate|selector=az';
            newUrl += '&activate|geonaam=azo&activate|selector=azo';
            newUrl += '&activate|geonaam=anw&activate|selector=anw';
            newUrl += '&activate|geonaam=aw&activate|selector=aw';
            newUrl += '&activate|geonaam=ao&activate|selector=ao';
            newUrl += '&activate|geonaam=awe&activate|selector=awe';
            newUrl += '&activate|geonaam=ad&activate|selector=ad';
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
