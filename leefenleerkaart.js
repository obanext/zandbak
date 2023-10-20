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

    // Toevoegen van geonamen aan de URL.
    geonamen.forEach(function (geonaam) {
        newUrl += '&activate|geonaam=' + geonaam;
    });

    // Controleer of er activiteiten zijn. Zo niet, gebruik dan de geonamen als selectors.
    if (activiteiten.length === 0) {
        geonamen.forEach(function (geonaam) {
            newUrl += '&activate|selector=' + geonaam;  // Gebruik geonaam als selector als er geen activiteiten zijn.
        });
    } else {
        // Voor elke geonaam, maak voor elke activiteit een aparte selector.
        geonamen.forEach(function (geonaam) {
            activiteiten.forEach(function (activiteit) {
                // Hier wordt voor elke activiteit een nieuwe selector-parameter gemaakt.
                newUrl += '&activate|selector=' + geonaam + activiteit;
            });
        });
    }

    // Update de iframe URL.
    iframe.src = newUrl;
}
