document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.querySelector('#all-areas'); // Selecteer de "Alle gebieden" checkbox
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    allAreasCheckbox.addEventListener('change', function() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input');
        if (this.checked) {
            geonaamCheckboxes.forEach(function(checkbox) {
                checkbox.checked = false; // deselecteer andere geonamen als "Alle gebieden" is geselecteerd
            });
        }
        updateMap(); // Update de kaart bij wijzigingen
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOpties = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOpties = document.querySelectorAll('.digitaal-opties input:checked');
        var allAreasSelected = allAreasCheckbox.checked;

        var newUrl = baseUrl;
        var allGeonamen = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad']; // Alle gebieden

        if (allAreasSelected) {
            allGeonamen.forEach(function(geonaam) {
                newUrl += '&activate|geonaam=' + geonaam;
                // De logica hier zou volgen wat er moet gebeuren wanneer "alle gebieden" is geselecteerd.
                newUrl += '&activate|selector=' + geonaam; // Voorbeeldlogica
            });
        } else {
            // Bestaande logica voor het afhandelen van individuele geonaam selecties
            geonaamCheckboxes.forEach(function (checkbox) {
                var geonaam = checkbox.value;
                newUrl += '&activate|geonaam=' + geonaam;

                if (activiteitCheckboxes.length === 0) {
                    // Als er geen activiteiten zijn geselecteerd, voeg dan alleen de geonaam toe.
                    newUrl += '&activate|selector=' + geonaam;
                } else {
                    activiteitCheckboxes.forEach(function (activiteitCheckbox) {
                        var activiteit = activiteitCheckbox.value;
                        newUrl += '&activate|selector=' + geonaam + activiteit; // combineer geonaam en activiteit
                        
                        var opties = (activiteit === 't' ? taalOpties : digitaalOpties);
                        opties.forEach(function (optieCheckbox) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optieCheckbox.value + '&'; // voeg opties toe
                        });
                    });
                }
            });
        }

        // Verwijder de laatste '&' als die er is
        newUrl = newUrl.endsWith('&') ? newUrl.slice(0, -1) : newUrl;

        // Stel de nieuwe URL in voor de iframe
        iframe.src = newUrl;
    }
});
