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

  // Functie om de URL-componenten voor geonamen en selectors samen te stellen
  function buildGeonamenSelectorsUrl() {
    var selectedGeonamen = getSelectedGeonamen();
    var selectedActiviteiten = getSelectedActiviteiten();
    var urlComponents = [];

    selectedGeonamen.forEach(function(geonaam) {
      // Voeg de geonaam toe zonder activiteitstype
      urlComponents.push("&activate|geonaam=" + geonaam);

      // Voeg de selector-component toe als er een activiteitstype is geselecteerd
      if (selectedActiviteiten.length > 0) {
        selectedActiviteiten.forEach(function(activiteit) {
          var selector = geonaam + activiteit;
          urlComponents.push("&activate|selector=" + selector);
        });
      } else {
        // Voeg de selector-component toe voor elke geonaamselectie zonder activiteitstype
        urlComponents.push("&activate|selector=" + geonaam);
      }
    });

    return urlComponents.join("");
  }

  // Functie om de kaart te updaten met de geselecteerde geonamen en activiteitstypen
  function updateMapWithGeonamenAndActiviteiten() {
    var geonamenSelectorsUrl = buildGeonamenSelectorsUrl();
    var finalUrl = baseUrl + geonamenSelectorsUrl;
    mapIframe.src = finalUrl;
  }

  // Voeg eventlisteners toe aan de geonaam- en activiteit-checkboxes om de kaart bij te werken wanneer er wijzigingen zijn
  var geonamCheckboxes = document.querySelectorAll(".geonaam");
  var activiteitCheckboxes = document.querySelectorAll(".activiteit");
  
  geonamCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithGeonamenAndActiviteiten);
  });

  activiteitCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithGeonamenAndActiviteiten);
  });

  // Initialiseer de kaart met de standaard URL
  mapIframe.src = baseUrl;
});
