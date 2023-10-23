document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.getElementById('all-areas');
    var iframe = document.getElementById('map');

    var baseUrl = 'https://localfocuswidgets.net/65367ce7b3c77?hide=dropdowns';

    function loadInitialMap() {
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
        iframe.src = allAreasUrl;
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!allAreasCheckbox.checked) {
                updateMap();
            } else {
                updateAllAreasMap(); // Nieuwe functie om de kaart bij te werken voor alle gebieden
            }
        });
    });

    allAreasCheckbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach(function(checkbox) {
                if (checkbox.classList.contains('geonaam')) {
                    checkbox.checked = false; // Alleen de geonaam-checkboxen uitschakelen
                }
            });
            loadInitialMap();
        } else {
            updateMap();
        }
    });

    function updateAllAreasMap() {
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var allAreasUrl = baseUrl;
        var geonamen = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad']; // Alle geonamen

        geonamen.forEach(function(geonaam) {
            allAreasUrl += '&activate|geonaam=' + geonaam;
        });

        var activiteiten = Array.from(activiteitCheckboxes, checkbox => checkbox.value);
        var taalOpties = Array.from(taalOptiesCheckboxes, checkbox => checkbox.value);
        var digitaalOpties = Array.from(digitaalOptiesCheckboxes, checkbox => checkbox.value);

        // Bouw de URL voor elke combinatie van geonaam en activiteit/taal/digitaal optie
        geonamen.forEach(function(geonaam) {
            if (activiteiten.length === 0) {
                allAreasUrl += '&activate|selector=' + geonaam;
            } else {
                activiteiten.forEach(function(activiteit) {
                    var opties = (activiteit === 't') ? taalOpties : digitaalOpties;
                    if (opties.length === 0) {
                        allAreasUrl += '&activate|selector=' + geonaam + activiteit;
                    } else {
                        opties.forEach(function(optie) {
                            allAreasUrl += '&activate|selector=' + geonaam + activiteit + optie;
                        });
                    }
                });
            }
        });

        iframe.src = allAreasUrl; // Update de URL van de iframe
    }

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl;

        var geonamen = Array.from(geonaamCheckboxes, checkbox => checkbox.value);
        var activiteiten = Array.from(activiteitCheckboxes, checkbox => checkbox.value);
        var taalOpties = Array.from(taalOptiesCheckboxes, checkbox => checkbox.value);
        var digitaalOpties = Array.from(digitaalOptiesCheckboxes, checkbox => checkbox.value);

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

        iframe.src = newUrl;
    }

    loadInitialMap();
});
