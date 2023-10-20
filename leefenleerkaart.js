document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam, .activiteit, .optie');
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/65314588b3bb5?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteit:checked');
        var optieCheckboxes = document.querySelectorAll('.optie:checked');

        // Basis URL voor de kaart.
        var newUrl = baseUrl;

        // Verzamelen van geselecteerde geonamen, activiteiten, en opties.
        var geonamen = [];
        geonaamCheckboxes.forEach(function (checkbox) {
            geonamen.push(checkbox.getAttribute('data-geonaam'));
        });

        var activiteiten = [];
        activiteitCheckboxes.forEach(function (checkbox) {
            activiteiten.push(checkbox.getAttribute('data-activiteit'));
        });

        var opties = [];
        optieCheckboxes.forEach(function (checkbox) {
            opties.push(checkbox.getAttribute('data-optie'));
        });

        // Toevoegen van geonamen aan de URL.
        geonamen.forEach(function (geonaam) {
            newUrl += '&activate|geonaam=' + geonaam;
        });

        // Logica voor het toevoegen van selectors op basis van geselecteerde geonamen, activiteiten, en opties.
        geonamen.forEach(function (geonaam) {
            if (activiteiten.length === 0 && opties.length === 0) {
                // Als er geen activiteiten of opties zijn geselecteerd, wordt de geonaam de selector.
                newUrl += '&activate|selector=' + geonaam;
            } else {
                // Voor elke combinatie van geonaam en activiteit, voeg een selector toe.
                activiteiten.forEach(function (activiteit) {
                    if (opties.length === 0) {
                        // Als er geen opties zijn geselecteerd, combineer geonaam met activiteit.
                        newUrl += '&activate|selector=' + geonaam + activiteit;
                    } else {
                        // Als er opties zijn geselecteerd, voeg deze toe aan de selector.
                        opties.forEach(function (optie) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optie;
                        });
                    }
                });
            }
        });

        // Als er geen geonamen zijn, voeg dan alleen activiteiten toe.
        if (geonamen.length === 0) {
            activiteiten.forEach(function (activiteit) {
                newUrl += '&activate|selector=' + activiteit;
            });
        }

        // Update de iframe URL.
        iframe.src = newUrl;
    }
});
