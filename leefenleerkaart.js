document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam, .activiteit');
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
        
        // Basis URL voor de kaart.
        var newUrl = baseUrl;

        // Verzamelen van geselecteerde geonamen en activiteiten.
        var geonamen = [];
        geonaamCheckboxes.forEach(function (checkbox) {
            geonamen.push(checkbox.getAttribute('data-geonaam'));
        });

        var activiteiten = [];
        activiteitCheckboxes.forEach(function (checkbox) {
            activiteiten.push(checkbox.getAttribute('data-activiteit'));
        });

        // Als er geen activiteiten zijn geselecteerd, gebruiken we de geonamen als selectors.
        if (activiteiten.length === 0) {
            geonamen.forEach(function (geonaam) {
                newUrl += '&activate|geonaam=' + geonaam;
                newUrl += '&activate|selector=' + geonaam;  // Geonaam wordt gebruikt als selector.
            });
        } else {
            // Toevoegen van geonamen aan de URL.
            geonamen.forEach(function (geonaam) {
                newUrl += '&activate|geonaam=' + geonaam;
            });

            // Voor elke geonaam, voeg elke activiteit toe als een aparte selector.
            geonamen.forEach(function (geonaam) {
                activiteiten.forEach(function (activiteit) {
                    newUrl += '&activate|selector=' + geonaam + activiteit;
                });
            });
        }

        // Update de iframe URL.
        iframe.src = newUrl;
    }
});
