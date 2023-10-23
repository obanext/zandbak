document.addEventListener('DOMContentLoaded', function () {
    var checkboxes = document.querySelectorAll('.geonaam, .activiteit, .activiteit-optie');
    var iframe = document.getElementById('map');
    var baseUrl = 'https://localfocuswidgets.net/6536375936ee8?hide=dropdowns';

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateMap();
        });
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteit:checked');
        var activiteitOptieCheckboxes = document.querySelectorAll('.activiteit-optie:checked');

        var newUrl = baseUrl;

        if (geonaamCheckboxes.length === 0) {
            activiteitCheckboxes.forEach(function (checkbox) {
                newUrl += '&activate|selector=' + checkbox.getAttribute('data-activiteit');
            });
        } else {
            geonaamCheckboxes.forEach(function (geonaamCheckbox) {
                var geonaam = geonaamCheckbox.getAttribute('data-geonaam');
                newUrl += '&activate|geonaam=' + geonaam;

                activiteitCheckboxes.forEach(function (activiteitCheckbox) {
                    var activiteit = activiteitCheckbox.getAttribute('data-activiteit');
                    newUrl += '&activate|selector=' + geonaam + activiteit;

                    activiteitOptieCheckboxes.forEach(function (optieCheckbox) {
                        var optie = optieCheckbox.getAttribute('data-optie');
                        if (optieCheckbox.getAttribute('data-activiteit') === activiteit) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optie;
                        }
                    });
                });
            });
        }

        iframe.src = newUrl;
    }
});
