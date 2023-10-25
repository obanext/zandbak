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
    "1000": "ac", "1001": "ac", "1002": "ac", "1003": "ac", "1004": "ac", 
    "1005": "ac", "1006": "ac", "1007": "ac", "1008": "ac", "1009": "ac", 
    "1010": "ac", "1011": "ac", "1012": "ac", "1013": "ac", "1014": "ac", 
    "1015": "ac", "1016": "ac", "1017": "ac", "1018": "ac", "1019": "ao",
    "1020": "an", "1021": "an", "1022": "an", "1023": "an", "1024": "an",
    "1025": "an", "1026": "an", "1027": "an", "1028": "an", "1029": "an", 
    "1030": "an", "1031": "an", "1032": "an", "1033": "an", "1034": "an",
    "1035": "an", "1036": "an", "1037": "an", "1038": "an", "1039": "an",
    "1040": "aw", "1041": "aw", "1042": "aw", "1043": "aw", "1044": "aw",
    "1045": "aw", "1046": "aw", "1047": "aw", "1048": "aw", "1049": "aw", 
    "1050": "aw", "1051": "aw", "1052": "aw", "1053": "aw", "1054": "aw",
    "1055": "aw", "1056": "aw", "1057": "aw", "1058": "aw", "1059": "aw",
    "1060": "anw", "1061": "anw", "1062": "anw", "1063": "anw", "1064": "anw",
    "1065": "anw", "1066": "anw", "1067": "anw", "1068": "anw", "1069": "anw",
    "1070": "az", "1071": "az", "1072": "az", "1073": "az", "1074": "az",
    "1075": "az", "1076": "az", "1077": "az", "1078": "az", "1079": "az", 
    "1080": "az", "1081": "az", "1082": "az", "1083": "az", "1086": "ao",
    "1087": "ao", "1088": "ao", "1089": "ao", "1090": "ao", "1091": "ao",
    "1092": "ao", "1093": "ao", "1094": "ao", "1095": "ao", "1096": "ao",
    "1097": "ao", "1098": "ao", "1099": "ao", "1100": "azo", "1101": "azo",
    "1102": "azo", "1103": "azo", "1104": "azo", "1105": "azo", "1106": "azo",
    "1107": "azo", "1108": "azo", "1110": "ad", "1112": "ad", "1113": "ad",
    "1114": "ad", "1115": "ad", "1380": "awp", "1382": "awp", "1383": "awp", 
    "1384": "awp"

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
        }
    }

    searchButton.addEventListener('click', handlePostcodeSearch);

    updateOptionVisibility();
    loadInitialMap();
});
