document.addEventListener('DOMContentLoaded', function () {
    // ... [Eerder initiatiegedeelte van de code blijft ongewijzigd]

    function updateMap() {
        // ... [Begin van de functie blijft ongewijzigd]

        geonamen.forEach(function (geonaam) {
            newUrl += '&activate|geonaam=' + geonaam;
            
            // Als er geen activiteit is geselecteerd, gebruik dan alleen de geonaam als selector.
            if (activiteiten.length === 0) {
                newUrl += '&activate|selector=' + geonaam;
            } else {
                // Als er activiteiten zijn, voeg dan voor elke activiteit een selector toe.
                activiteiten.forEach(function (activiteit) {
                    var opties = (activiteit === 't') ? taalOpties : digitaalOpties;

                    // Als er geen specifieke opties zijn geselecteerd, gebruik dan de activiteit.
                    if (opties.length === 0) {
                        newUrl += '&activate|selector=' + geonaam + activiteit;
                    } else {
                        // Voeg voor elke optie een aparte selector toe.
                        opties.forEach(function (optie) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optie + '&'; // Veranderd om individuele selectors toe te voegen
                        });
                    }
                });
            }
        });

        // Verwijder de laatste '&' als deze bestaat om URL-formatting problemen te voorkomen
        newUrl = newUrl.endsWith('&') ? newUrl.slice(0, -1) : newUrl;

        // Update de iframe URL.
        iframe.src = newUrl;
    }
});
