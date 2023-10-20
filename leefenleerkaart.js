document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam, .activiteit, .niveau');
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/65314588b3bb5?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    function updateMap() {
        var geonaamValues = [];
        var activiteitValues = [];
        var niveauValues = [];

        // Verzamel geselecteerde geonamen, activiteiten en niveaus.
        document.querySelectorAll('.geonaam:checked').forEach(function (checkbox) {
            geonaamValues.push(checkbox.getAttribute('data-geonaam'));
        });

        document.querySelectorAll('.activiteit:checked').forEach(function (checkbox) {
            activiteitValues.push(checkbox.getAttribute('data-activiteit'));
        });

        document.querySelectorAll('.niveau:checked').forEach(function (checkbox) {
            niveauValues.push(checkbox.getAttribute('data-niveau'));
        });

        // Begin met het opbouwen van de URL
        var newUrl = baseUrl;

        // Bouw de URL op voor elke combinatie van geonaam, activiteit en niveau.
        geonaamValues.forEach(function (geonaam) {
            activiteitValues.forEach(function (activiteit) {
                niveauValues.forEach(function (niveau) {
                    newUrl += '&activate|geonaam=' + geonaam;
                    newUrl += '&activate|selector=' + geonaam + activiteit + niveau;
                });
            });
        });

        // Als er geen geonamen, activiteiten of niveaus zijn geselecteerd, gebruik dan de standaardwaarde.
        if (!geonaamValues.length && !activiteitValues.length && !niveauValues.length) {
            newUrl += '&activate|selector=aa';
        }

        // Update de iframe URL
        iframe.src = newUrl;
    }
});
