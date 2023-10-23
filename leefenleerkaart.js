document.addEventListener('DOMContentLoaded', function () {
    // Selecteer alle relevante checkboxes
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    
    // Basis URL voor de kaart
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns&activate|selector=aa';

    // Referentie naar de iframe
    var iframe = document.getElementById('map');

    // Functie die de initiële kaart laadt
    function loadInitialMap() {
        iframe.src = baseUrl; // Dit stelt de initiële URL van de iframe in
    }

    // Voeg event listeners toe aan alle checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap(); // Update de kaart bij elke verandering
        });
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

        // Update de iframe URL met de nieuwe URL
        iframe.src = newUrl;
    }

    // Laad de initiële kaart wanneer de pagina wordt geladen
    loadInitialMap();
});
