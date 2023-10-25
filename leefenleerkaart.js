document.addEventListener("DOMContentLoaded", function() {
  var mapIframe = document.getElementById("map");
  var baseUrl = "https://localfocuswidgets.net/6538ef99859c1?hide=dropdowns";

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

  // Functie om de geselecteerde taalopties op te halen
  function getSelectedTaalOpties() {
    var selectedTaalOpties = [];
    var taalOptieCheckboxes = document.querySelectorAll(".taal-optie:checked");

    taalOptieCheckboxes.forEach(function(checkbox) {
      selectedTaalOpties.push(checkbox.value);
    });

    return selectedTaalOpties;
  }

  // Functie om de geselecteerde digitaalopties op te halen
  function getSelectedDigitaalOpties() {
    var selectedDigitaalOpties = [];
    var digitaalOptieCheckboxes = document.querySelectorAll(".digitaal-optie:checked");

    digitaalOptieCheckboxes.forEach(function(checkbox) {
      selectedDigitaalOpties.push(checkbox.value);
    });

    return selectedDigitaalOpties;
  }

  // Functie om de URL-componenten voor geonamen, selectors, activiteitstypen, en taalopties/digitaalopties samen te stellen
  function buildUrlComponents() {
    var selectedGeonamen = getSelectedGeonamen();
    var selectedActiviteiten = getSelectedActiviteiten();
    var selectedTaalOpties = getSelectedTaalOpties();
    var selectedDigitaalOpties = getSelectedDigitaalOpties();
    var urlComponents = [];

    selectedGeonamen.forEach(function(geonaam) {
      urlComponents.push("&activate|geonaam=" + geonaam);

      if (selectedActiviteiten.length > 0) {
        selectedActiviteiten.forEach(function(activiteit) {
          urlComponents.push("&activate|selector=" + geonaam + activiteit);
          
          if (activiteit === 't' && selectedTaalOpties.length > 0) {
            selectedTaalOpties.forEach(function(taalOptie) {
              urlComponents.push("&activate|selector=" + geonaam + activiteit + taalOptie);
            });
          }

          if (activiteit === 'd' && selectedDigitaalOpties.length > 0) {
            selectedDigitaalOpties.forEach(function(digitaalOptie) {
              urlComponents.push("&activate|selector=" + geonaam + activiteit + digitaalOptie);
            });
          }
        });
      }
    });

    return urlComponents.join("");
  }

  // Functie om de kaart te updaten met de geselecteerde geonamen, activiteitstypen, taalopties en digitaalopties
  function updateMapWithSelections() {
    var urlComponents = buildUrlComponents();
    var finalUrl = baseUrl + urlComponents;
    mapIframe.src = finalUrl;
  }

  // Voeg eventlisteners toe aan de geonaam- en activiteit-checkboxes om de kaart bij te werken wanneer er wijzigingen zijn
  var geonamCheckboxes = document.querySelectorAll(".geonaam");
  var activiteitCheckboxes = document.querySelectorAll(".activiteit");
  var taalOptieCheckboxes = document.querySelectorAll(".taal-optie");
  var digitaalOptieCheckboxes = document.querySelectorAll(".digitaal-optie");

  geonamCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithSelections);
  });

  activiteitCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithSelections);
  });

  taalOptieCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithSelections);
  });

  digitaalOptieCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithSelections);
  });

  // Initialiseer de kaart met de standaard URL
  mapIframe.src = baseUrl;
});
