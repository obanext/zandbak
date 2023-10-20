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

        // Als er geen geonaam is geselecteerd, voegen we de activiteiten toe aan de selector.
        if (geonaamCheckboxes.length === 0) {
            var activiteiten = [];
            activiteitCheckboxes.forEach(function (checkbox) {
                activiteiten.push(checkbox.getAttribute('data-activiteit'));
            });
            newUrl += '&activate|selector=' + activiteiten.join('');
        } else {
            // We bouwen de URL op door elke geonaam te doorlopen.
            geonaamCheckboxes.forEach(function (geonaamCheckbox) {
                var geonaam = geonaamCheckbox.getAttribute('data-geonaam');
                
                newUrl += '&activate|geonaam=' + geonaam;

                // Binnen elke geonaam, voegen we de relevante activiteiten toe.
                var selectors = [geonaam]; // De geonaam wordt ook als selector opgenomen.

                activiteitCheckboxes.forEach(function (activiteitCheckbox) {
                    var activiteit = activiteitCheckbox.getAttribute('data-activiteit');

                    // Controleer of de activiteit relevant is voor de geonaam.
                    if ((activiteit === 't' && geonaamCheckbox.getAttribute('data-taaloptie')) ||
                        (activiteit === 'd' && geonaamCheckbox.getAttribute('data-digitaaloptie')) ||
                        (activiteit !== 't' && activiteit !== 'd')) {
                        selectors.push(activiteit);
                    }
                });

                newUrl += '&activate|selector=' + selectors.join('');
            });
        }

        // Update de iframe URL.
        iframe.src = newUrl;
    }
});
