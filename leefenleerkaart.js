document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.getElementById('all-areas'); // De nieuwe checkbox voor alle gebieden
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    // Event listener voor de nieuwe "alle gebieden" checkbox
    allAreasCheckbox.addEventListener('change', function () {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input');
        if (allAreasCheckbox.checked) {
            geonaamCheckboxes.forEach(function (checkbox) {
                checkbox.checked = false; // Deselecteer alle geonaam checkboxes
            });
        }
        updateMap(); // Update de kaart wanneer "alle gebieden" wordt aangevinkt of uitgevinkt
    });

    // Event listeners voor de overige checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!allAreasCheckbox.checked) {
                updateMap(); // Update de kaart alleen als "alle gebieden" niet is geselecteerd
            }
        });
    });

    // De functie om de kaart te updaten op basis van de geselecteerde criteria
    function updateMap() {
        var newUrl = baseUrl;
        var allAreasSelected = allAreasCheckbox.checked;
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOpties = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOpties = document.querySelectorAll('.digitaal-opties input:checked');

        // Als "alle gebieden" is geselecteerd, voeg dan alle geonamen toe aan de URL
        if (allAreasSelected) {
            newUrl += '&activate|geonaam=ac&activate|geonaam=an&activate|geonaam=az&activate|geonaam=azo&activate|geonaam=anw&activate|geonaam=aw&activate|geonaam=ao&activate|geonaam=awe&activate|geonaam=ad';
        } else {
            // Als "alle gebieden" niet is geselecteerd, bouw dan de URL op basis van individuele selecties
            geonaamCheckboxes.forEach(function (checkbox) {
                newUrl += '&activate|geonaam=' + checkbox.value; // Voeg geselecteerde geonamen toe

                // Bijwerken van de selector parameter wanneer de geonaam selectie verandert.
                if (activiteitCheckboxes.length === 0) {
                    newUrl += '&activate|selector=' + checkbox.value;
                } else {
                    activiteitCheckboxes.forEach(function (actCheckbox) {
                        newUrl += '&activate|selector=' + checkbox.value + actCheckbox.value;
                    });
                }
            });
        }

        // Als er activiteiten zijn geselecteerd, moeten we deze toevoegen aan de URL
        activiteitCheckboxes.forEach(function (checkbox) {
            newUrl += '&activate|selector=' + checkbox.value; // Voeg geselecteerde activiteiten toe
        });
        taalOpties.forEach(function (checkbox) {
            newUrl += '&activate|selector=' + checkbox.value; // Voeg geselecteerde taalopties toe
        });
        digitaalOpties.forEach(function (checkbox) {
            newUrl += '&activate|selector=' + checkbox.value; // Voeg geselecteerde digitale opties toe
        });

        iframe.src = newUrl; // Update de iframe bron naar de nieuwe URL
    }

    // Een initiële update van de kaart bij het laden van de pagina
    updateMap();
});
