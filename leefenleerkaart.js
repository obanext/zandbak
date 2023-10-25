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

  // Functie om de weergave van de taalopties en digitaalopties te beheren
  function toggleOptionsVisibility() {
    var taalOptiesDiv = document.querySelector(".taal-opties");
    var digitaalOptiesDiv = document.querySelector(".digitaal-opties");
    var activiteitCheckboxes = document.querySelectorAll(".activiteit:checked");

    // Controleer of "Taal" is geselecteerd
    if (activiteitCheckboxes.some(function(checkbox) { return checkbox.value === "t"; })) {
      taalOptiesDiv.style.display = "block";
    } else {
      taalOptiesDiv.style.display = "none";
    }

    // Controleer of "Digitaal" is geselecteerd
    if (activiteitCheckboxes.some(function(checkbox) { return checkbox.value === "d"; })) {
      digitaalOptiesDiv.style.display = "block";
    } else {
      digitaalOptiesDiv.style.display = "none";
    }
  }

  // Functie om de URL-componenten voor geonamen en selectors samen te stellen
  function buildGeonamenSelectorsUrl() {
    var selectedGeonamen = getSelectedGeonamen();
    var selectedActiviteiten = getSelectedActiviteiten();
    var urlComponents = [];

    selectedGeonamen.forEach(function(geonaam) {
      selectedActiviteiten.forEach(function(activiteit) {
        var selector = geonaam + activiteit;
        urlComponents.push("&activate|geonaam=" + geonaam);
        urlComponents.push("&activate|selector=" + selector);
      });
    });

    return urlComponents.join("");
  }

  // Functie om de kaart te updaten met de geselecteerde geonamen en activiteitstypen
  function updateMapWithGeonamenAndActiviteiten() {
    var geonamenSelectorsUrl = buildGeonamenSelectorsUrl();
    var finalUrl = baseUrl + geonamenSelectorsUrl;
    mapIframe.src = finalUrl;
  }

  // Voeg een eventlistener toe aan de geonaam-checkboxes om de kaart bij te werken wanneer er wijzigingen zijn
  var geonaamCheckboxes = document.querySelectorAll(".geonaam");

  geonaamCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateMapWithGeonamenAndActiviteiten);
  });

  // Voeg een eventlistener toe aan de activiteit-checkboxes om de optiesweergave bij te werken
  var activiteitCheckboxes = document.querySelectorAll(".activiteit");

  activiteitCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
      updateMapWithGeonamenAndActiviteiten();
      toggleOptionsVisibility();
    });
  });

  // Initialiseer de kaart met de standaard URL
  mapIframe.src = baseUrl;
});
