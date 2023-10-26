document.addEventListener("DOMContentLoaded", function() {
  var mapIframe = document.getElementById("map");
  var baseUrl = "https://localfocuswidgets.net/6538ef99859c1?hide=dropdowns";
  var allAreasCheckbox = document.getElementById("all-areas"); // De checkbox voor 'alle gebieden'.

  // Functie om de geselecteerde geonamen op te halen
  function getSelectedGeonamen() {
    var selectedGeonamen = [];
    var geonamCheckboxes = document.querySelectorAll(".geonaam:checked");

    geonamCheckboxes.forEach(function(checkbox) {
      selectedGeonamen.push(checkbox.value);
    });

    return selectedGeonamen;
  }

  // Functie om de geselecteerde activiteitstypen op te halen
  function getSelectedActiviteiten() {
    var selectedActiviteiten = [];
    var activiteitCheckboxes = document.querySelectorAll(".activiteit:checked");

    activiteitCheckboxes.forEach(function(checkbox) {
      selectedActiviteiten.push(checkbox.value);
    });

    return selectedActiviteiten;
  }

  // Functie om de URL-componenten voor geonamen en selectors samen te stellen
  function buildGeonamenSelectorsUrl() {
    var selectedGeonamen = getSelectedGeonamen();
    var selectedActiviteiten = getSelectedActiviteiten();
    var urlComponents = [];

    selectedGeonamen.forEach(function(geonaam) {
      urlComponents.push("&activate|geonaam=" + geonaam);

      if (selectedActiviteiten.length > 0) {
        selectedActiviteiten.forEach(function(activiteit) {
          var selector = geonaam + activiteit;
          urlComponents.push("&activate|selector=" + selector);
        });
      } else {
        urlComponents.push("&activate|selector=" + geonaam);
      }
    });

    return urlComponents.join("");
  }

  // Functie om te controleren of 'alle gebieden' is geselecteerd
  function isAllAreasSelected() {
    return allAreasCheckbox.checked;
  }

  // Functie om de URL-componenten voor alle geonamen samen te stellen
  function buildAllGeonamenUrl() {
    // Stel je voor dat dit alle mogelijke geonamen zijn, dit moet worden bijgewerkt.
    var alleGeonamen = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad'];
    var urlComponents = [];

    alleGeonamen.forEach(function(geonaam) {
      urlComponents.push("&activate|geonaam=" + geonaam);
      urlComponents.push("&activate|selector=" + geonaam);
    });

    return urlComponents.join("");
  }

  // Functie om de kaart te updaten gebaseerd op de 'alle gebieden' selectie
  function updateMapWithAllAreas() {
    var allGeonamenUrl = buildAllGeonamenUrl();
    mapIframe.src = baseUrl + allGeonamenUrl;
  }

  // Functie om de kaart te updaten met de geselecteerde geonamen en activiteitstypen
  function updateMap() {
    if (isAllAreasSelected()) {
      updateMapWithAllAreas();
    } else {
      var urlComponents = buildGeonamenSelectorsUrl();
      mapIframe.src = baseUrl + urlComponents;
    }
  }

  // Event listeners voor checkboxes om de kaart bij te werken wanneer selecties veranderen
  document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      if (checkbox === allAreasCheckbox && checkbox.checked) {
        // Deselecteer alle andere checkboxes als 'alle gebieden' is geselecteerd
        document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
          if (box !== allAreasCheckbox) box.checked = false;
        });
      } else if (checkbox !== allAreasCheckbox && checkbox.checked) {
        // Als een andere optie wordt geselecteerd, deselecteer 'alle gebieden'
        allAreasCheckbox.checked = false;
      }

      updateMap(); // Update de kaart op basis van de huidige selecties
    });
  });
});
