document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOpties = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOpties = document.querySelectorAll('.digitaal-opties input:checked');

        var geonamen = [];
        geonaamCheckboxes.forEach(function (checkbox) {
            geonamen.push(checkbox.value);
        });

        var activiteiten = [];
        activiteitCheckboxes.forEach(function (checkbox) {
            activiteiten.push(checkbox.value);
        });

        var taalOptieWaarden = [];
        taalOpties.forEach(function (checkbox) {
            taalOptieWaarden.push(checkbox.value);
        });

        var digitaalOptieWaarden = [];
        digitaalOpties.forEach(function (checkbox) {
            digitaalOptieWaarden.push(checkbox.value);
        });

        var newUrl = baseUrl;

        if (geonamen.length === 0 && activiteiten.length === 0) {
            newUrl += '&activate|selector=aa'; // default selector wanneer niets is geselecteerd
        } else {
            geonamen.forEach(function (geonaam) {
                newUrl += '&activate|geonaam=' + geonaam;
                if (activiteiten.length === 0) {
                    newUrl += '&activate|selector=' + geonaam;
                } else {
                    activiteiten.forEach(function (activiteit) {
                        var opties = activiteit === 't' ? taalOptieWaarden : digitaalOptieWaarden;

                        if (opties.length === 0) {
                            newUrl += '&activate|selector=' + geonaam + activiteit;
                        } else {
                            opties.forEach(function (optie) {
                                newUrl += '&activate|selector=' + geonaam + activiteit + optie + '&';
                            });
                        }
                    });
                }
            });
        }

        newUrl = newUrl.endsWith('&') ? newUrl.slice(0, -1) : newUrl; // Verwijder het laatste '&' teken
        iframe.src = newUrl; // Stel de nieuwe URL in voor de iframe
    }
});
