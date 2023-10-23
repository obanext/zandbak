document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.querySelector('#all-areas'); // De checkbox voor "Alle gebieden"
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/65314588b3bb5?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            // Als een specifiek gebied wordt geselecteerd, hef dan de selectie van "Alle gebieden" op.
            if (!checkbox.isSameNode(allAreasCheckbox) && checkbox.checked) {
                allAreasCheckbox.checked = false;
            }
            updateMap();
        });
    });

    // Event listener voor de "Alle gebieden" checkbox.
    allAreasCheckbox.addEventListener('change', function() {
        if (allAreasCheckbox.checked) {
            // Als "Alle gebieden" is geselecteerd, deselecteer dan alle specifieke gebieden.
            var areaCheckboxes = document.querySelectorAll('.geonaam-selector input');
            areaCheckboxes.forEach(function(checkbox) {
                checkbox.checked = false;
            });
        }
        updateMap(); // Update de kaart op basis van de huidige selecties.
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOpties = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOpties = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl;

        // Als "Alle gebieden" is geselecteerd, voeg dan alle geonamen toe.
        if (allAreasCheckbox.checked) {
            newUrl += '&activate|geonaam=ac,an,az,azo,anw,aw,ao,awe,ad'; // Alle gebieden
            newUrl += '&activate|selector=ac,an,az,azo,anw,aw,ao,awe,ad'; // Selectors voor alle gebieden
        } else {
            // Voeg alleen de geselecteerde geonamen en activiteiten toe.
            geonaamCheckboxes.forEach(function (checkbox) {
                newUrl += '&activate|geonaam=' + checkbox.value;
            });
            activiteitCheckboxes.forEach(function (checkbox) {
                newUrl += '&activate|selector=' + checkbox.value;
            });
        }

        // Behandel activiteitsopties (indien aanwezig).
        taalOpties.forEach(function (checkbox) {
            newUrl += '&activate|selector=' + checkbox.value;
        });
        digitaalOpties.forEach(function (checkbox) {
            newUrl += '&activate|selector=' + checkbox.value;
        });

        iframe.src = newUrl; // Update de URL van de kaart.
    }
});
