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

  // Functie om de URL-componenten voor geonamen en selectors samen te stellen
  function buildGeonamenSelectorsUrl() {
    var selectedGeonamen = getSelectedGeonamen();
    var urlComponents = [];

    selectedGeonamen.forEach(function(geonaam) {
      urlComponents.push("&activate|geonaam=" + geonaam);
      urlComponents.push("&activate|selector=" + geonaam);
    });

    return urlComponents.join("");
  }

  // Functie om de kaart te updaten met de geselecteerde geonamen
  function updateMapWithGeonamen() {
    var geonamenSelectorsUrl = buildGeonamenSelectorsUrl();
    var finalUrl = baseUrl + geonamenSelectorsUrl;
    mapIframe.src = finalUrl;
  }

  // Voeg een eventlistener toe aan de geonaam-checkboxes om de kaart bij te werken wanneer er wijzigingen zijn
  var geonamCheckboxes = document.querySelectorAll(".geonaam");
  geonamCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithGeonamen);
  });

  // Initialiseer de kaart met de standaard URL
  mapIframe.src = baseUrl;
});
