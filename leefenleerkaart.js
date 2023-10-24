document.addEventListener('DOMContentLoaded', function () {
    // Selecteer alle relevante checkboxes en de 'Alle gebieden' checkbox
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.getElementById('all-areas');
    var iframe = document.getElementById('map');

    // Basis URL voor de kaart
    var baseUrl = 'https://localfocuswidgets.net/65376eb705de9?hide=dropdowns';

    // Selecteer de elementen die de taal- en digitaalopties bevatten
    const taalCheckbox = document.querySelector('.activiteiten-soort input[data-activiteit="t"]');
    const digitaalCheckbox = document.querySelector('.activiteiten-soort input[data-activiteit="d"]');
    const taalOpties = document.querySelector('.taal-opties');
    const digitaalOpties = document.querySelector('.digitaal-opties');

    function updateOptionVisibility() {
        taalOpties.style.display = taalCheckbox.checked ? 'block' : 'none';
        digitaalOpties.style.display = digitaalCheckbox.checked ? 'block' : 'none';
    }

    // Functie die de kaart laadt met alle gebieden geselecteerd
    function loadInitialMap() {
        // Stel de URL samen voor alle gebieden
        var allAreasUrl = baseUrl +
            '&activate|geonaam=ac&activate|selector=ac' +
            '&activate|geonaam=an&activate|selector=an' +
            '&activate|geonaam=az&activate|selector=az' +
            '&activate|geonaam=azo&activate|selector=azo' +
            '&activate|geonaam=anw&activate|selector=anw' +
            '&activate|geonaam=aw&activate|selector=aw' +
            '&activate|geonaam=ao&activate|selector=ao' +
            '&activate|geonaam=awe&activate|selector=awe' +
            '&activate|geonaam=ad&activate|selector=ad';
        iframe.src = allAreasUrl; // Update de iframe met de nieuwe URL
    }

    // Event listeners voor alle checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            // Als 'Alle gebieden' niet is geselecteerd, update dan de kaart
            if (!allAreasCheckbox.checked) {
                updateMap();
            }
            // Update de zichtbaarheid van de opties op basis van de staat van de checkboxes
            updateOptionVisibility();
        });
    });

    // Event listener voor 'Alle gebieden' checkbox
    allAreasCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Deselecteer andere checkboxes als 'Alle gebieden' is geselecteerd
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = false;
            });
            loadInitialMap(); // Laad de kaart met alle gebieden
        } else {
            updateMap(); // Als 'Alle gebieden' is uitgeschakeld, update dan de kaart
        }
        // Update de zichtbaarheid van de opties op basis van de staat van de checkboxes
        updateOptionVisibility();
    });

    // Functie die de kaart update op basis van de geselecteerde opties
    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl; // Start met de basis URL

        // Verzamelen van alle geselecteerde geonamen, activiteiten, en opties
        var geonamen = Array.from(geonaamCheckboxes, checkbox => checkbox.value);
        var activiteiten = Array.from(activiteitCheckboxes, checkbox => checkbox.value);
        var taalOpties = Array.from(taalOptiesCheckboxes, checkbox => checkbox.value);
        var digitaalOpties = Array.from(digitaalOptiesCheckboxes, checkbox => checkbox.value);

        // Bouw de nieuwe URL op basis van de geselecteerde opties
        geonamen.forEach(function(geonaam) {
            newUrl += '&activate|geonaam=' + geonaam;
            if (activiteiten.length === 0) {
                newUrl += '&activate|selector=' + geonaam;
            } else {
                activiteiten.forEach(function(activiteit) {
                    var opties = (activiteit === 't') ? taalOpties : digitaalOpties;
                    if (opties.length === 0) {
                        newUrl += '&activate|selector=' + geonaam + activiteit;
                    } else {
                        opties.forEach(function(optie) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optie;
                        });
                    }
                });
            }
        });

        // Update de URL van de iframe
        iframe.src = newUrl;
    }

    // Update de zichtbaarheid van de opties wanneer de pagina laadt
    updateOptionVisibility();

    // Laad de initiële kaart wanneer de pagina wordt geladen
    loadInitialMap();
});
