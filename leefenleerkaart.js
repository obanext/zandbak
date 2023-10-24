document.addEventListener('DOMContentLoaded', function () {
    // Selecteer alle relevante checkboxes en de 'Alle gebieden' checkbox
    var checkboxes = document.querySelectorAll('.geonaam-selector input, .activiteiten-soort input, .taal-opties input, .digitaal-opties input');
    var allAreasCheckbox = document.getElementById('all-areas');
    var iframe = document.getElementById('map');

    // Basis URL voor de kaart
    var baseUrl = 'https://localfocuswidgets.net/65376eb705de9?hide=dropdowns';

    // Selecteer de elementen die de taal- en digitaalopties bevatten
    const taalCheckbox = document.querySelector('.activiteiten-soort input[data-activiteit="t"]');
    const digitaalCheckbox = document.querySelector('.activiteiten-soort input[data-activiteit="d"]');
    const taalOpties = document.querySelector('.taal-opties');
    const digitaalOpties = document.querySelector('.digitaal-opties');

    // Postcode-zoekveld en knop
    var postcodeInput = document.getElementById('postcode');
    var searchButton = document.getElementById('search-button');

    // Overeenkomen van postcodes met geonamen
   const postcodeMapping = {
    "1000": "AC", "1001": "AC", "1002": "AC", "1003": "AC", "1004": "AC", 
    "1005": "AC", "1006": "AC", "1007": "AC", "1008": "AC", "1009": "AC", 
    "1010": "AC", "1011": "AC", "1012": "AC", "1013": "AC", "1014": "AC", 
    "1015": "AC", "1016": "AC", "1017": "AC", "1018": "AC", "1019": "AO",
    "1020": "AN", "1021": "AN", "1022": "AN", "1023": "AN", "1024": "AN",
    "1025": "AN", "1026": "AN", "1027": "AN", "1028": "AN", "1029": "AN",
    "1030": "AN", "1031": "AN", "1032": "AN", "1033": "AN", "1034": "AN",
    "1035": "AN", "1036": "AN", "1037": "AN", "1038": "AN", "1039": "AN",
    "1040": "AW", "1041": "AW", "1042": "AW", "1043": "AW", "1044": "AW",
    "1045": "AW", "1046": "AW", "1047": "AW", "1048": "AW", "1049": "AW",
    "1050": "AW", "1051": "AW", "1052": "AW", "1053": "AW", "1054": "AW",
    "1055": "AW", "1056": "AW", "1057": "AW", "1058": "AW", "1059": "AW",
    "1060": "ANW", "1061": "ANW", "1062": "ANW", "1063": "ANW", "1064": "ANW",
    "1065": "ANW", "1066": "ANW", "1067": "ANW", "1068": "ANW", "1069": "ANW",
    "1070": "AZ", "1071": "AZ", "1072": "AZ", "1073": "AZ", "1074": "AZ",
    "1075": "AZ", "1076": "AZ", "1077": "AZ", "1078": "AZ", "1079": "AZ",
    "1080": "AZ", "1081": "AZ", "1082": "AZ", "1083": "AZ", "1086": "AO",
    "1087": "AO", "1088": "AO", "1089": "AO", "1090": "AO", "1091": "AO",
    "1092": "AO", "1093": "AO", "1094": "AO", "1095": "AO", "1096": "AO",
    "1097": "AO", "1098": "AO", "1099": "AO", "1100": "AZO", "1101": "AZO",
    "1102": "AZO", "1103": "AZO", "1104": "AZO", "1105": "AZO", "1106": "AZO",
    "1107": "AZO", "1108": "AZO", "1110": "AD", "1112": "AD", "1113": "AD",
    "1114": "AD", "1115": "AD", "1380": "AWP", "1382": "AWP", "1383": "AWP",
    "1384": "AWP"
};

    function updateOptionVisibility() {
        taalOpties.style.display = taalCheckbox.checked ? 'block' : 'none';
        digitaalOpties.style.display = digitaalCheckbox.checked ? 'block' : 'none';
    }

    function loadInitialMap() {
        var allAreasUrl = baseUrl + '&activate|geonaam=ac&activate|selector=ac' +
            '&activate|geonaam=an&activate|selector=an' +
            '&activate|geonaam=az&activate|selector=az' +
            '&activate|geonaam=azo&activate|selector=azo' +
            '&activate|geonaam=anw&activate|selector=anw' +
            '&activate|geonaam=aw&activate|selector=aw' +
            '&activate|geonaam=ao&activate|selector=ao' +
            '&activate|geonaam=awe&activate|selector=awe' +
            '&activate|geonaam=ad&activate|selector=ad';
        iframe.src = allAreasUrl;
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!allAreasCheckbox.checked) {
                updateMap();
            }
            updateOptionVisibility();
        });
    });

    allAreasCheckbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = false;
            });
            loadInitialMap();
        } else {
            updateMap();
        }
        updateOptionVisibility();
    });

    function updateMap() {
        var geonaamCheckboxes = document.querySelectorAll('.geonaam-selector input:checked');
        var activiteitCheckboxes = document.querySelectorAll('.activiteiten-soort input:checked');
        var taalOptiesCheckboxes = document.querySelectorAll('.taal-opties input:checked');
        var digitaalOptiesCheckboxes = document.querySelectorAll('.digitaal-opties input:checked');

        var newUrl = baseUrl;

        var geonamen = Array.from(geonaamCheckboxes, checkbox => checkbox.value);
        var activiteiten = Array.from(activiteitCheckboxes, checkbox => checkbox.value);
        var taalOpties = Array.from(taalOptiesCheckboxes, checkbox => checkbox.value);
        var digitaalOpties = Array.from(digitaalOptiesCheckboxes, checkbox => checkbox.value);

        geonamen.forEach(function(geonaam) {
            newUrl += '&activate|geonaam=' + geonaam;
            if (activiteiten.length === 0) {
                newUrl += '&activate|selector=' + geonaam;
            } else {
                activiteiten.forEach(function(activiteit) {
                    var opties = (activiteit === 't') ? taalOpties : digitaalOpties;
                    if (opties.length === 0) {
                        newUrl += '&activate|selector=' + geonaam + activiteit;
                    } else {
                        opties.forEach(function(optie) {
                            newUrl += '&activate|selector=' + geonaam + activiteit + optie;
                        });
                    }
                });
            }
        });

        iframe.src = newUrl;
    }

    function handlePostcodeSearch() {
        var postcode = postcodeInput.value;
        if (postcode.length !== 4 || isNaN(postcode)) {
            alert("Voer een geldige viercijferige postcode in.");
            return;
        }

        var geonaam = postcodeMapping[postcode];
        if (!geonaam) {
            alert("Geen gebied gevonden met deze postcode.");
            return;
        }

        var correspondingCheckbox = document.querySelector(`input[data-geonaam="${geonaam}"]`);
        if (correspondingCheckbox) {
            correspondingCheckbox.checked = true;
            correspondingCheckbox.dispatchEvent(new Event('change'));
        }
    }

    searchButton.addEventListener('click', handlePostcodeSearch);

    updateOptionVisibility();
    loadInitialMap();
});
