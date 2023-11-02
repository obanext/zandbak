document.addEventListener("DOMContentLoaded", function() {
  var mapIframe = document.getElementById("map");
  var baseUrl = "https://localfocuswidgets.net/6538ef99859c1?hide=dropdowns";
  var allAreasCheckbox = document.getElementById("all-areas");

  function getSelectedGeonamen() {
    var selectedGeonamen = [];
    var geonamCheckboxes = document.querySelectorAll(".geonaam:checked");
    geonamCheckboxes.forEach(function(checkbox) {
      selectedGeonamen.push(checkbox.value);
    });
    return selectedGeonamen;
  }

  function getSelectedActiviteiten() {
    var selectedActiviteiten = [];
    var activiteitCheckboxes = document.querySelectorAll(".activiteit:checked");
    activiteitCheckboxes.forEach(function(checkbox) {
      selectedActiviteiten.push(checkbox.value);
    });
    return selectedActiviteiten;
  }

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

  function isAllAreasSelected() {
    return allAreasCheckbox.checked;
  }

  function buildAllGeonamenUrl() {
    var alleGeonamen = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad'];
    var urlComponents = [];
    alleGeonamen.forEach(function(geonaam) {
      urlComponents.push("&activate|geonaam=" + geonaam);
      urlComponents.push("&activate|selector=" + geonaam);
    });
    return urlComponents.join("");
  }

  function updateMapWithAllAreas() {
    var allGeonamenUrl = buildAllGeonamenUrl();
    mapIframe.src = baseUrl + allGeonamenUrl;
  }

  function updateMap() {
    if (isAllAreasSelected()) {
      updateMapWithAllAreas();
    } else {
      var urlComponents = buildGeonamenSelectorsUrl();
      mapIframe.src = baseUrl + urlComponents;
    }
  }

  document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      if (checkbox === allAreasCheckbox && checkbox.checked) {
        document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
          if (box !== allAreasCheckbox) box.checked = false;
        });
      } else if (checkbox !== allAreasCheckbox && checkbox.checked) {
        allAreasCheckbox.checked = false;
      }
      updateMap();
    });
  });
  
  updateMap();
  
  document.getElementById("postcode").addEventListener("input", function() {
    var postcode = parseInt(this.value, 10);
    var geonaam = null;
    if (postcode >= 1000 && postcode <= 1018) geonaam = "AC";
    if (postcode >= 1019 && postcode <= 1019) geonaam = "AO";
    if (postcode >= 1020 && postcode <= 1039) geonaam = "AN";
    if (postcode >= 1040 && postcode <= 1059) geonaam = "AW";
    if (postcode >= 1060 && postcode <= 1069) geonaam = "ANW";
    if (postcode >= 1070 && postcode <= 1083) geonaam = "AZ";
    if (postcode >= 1084 && postcode <= 1099) geonaam = "AO";
    if (postcode >= 1100 && postcode <= 1108) geonaam = "AZO";
    if (postcode >= 1110 && postcode <= 1115) geonaam = "AD";
    if (postcode >= 1380 && postcode <= 1384) geonaam = "AWP";
    if (geonaam) {
      var newUrl = baseUrl + "&activate|geonaam=" + geonaam.toLowerCase() + "&activate|selector=" + geonaam.toLowerCase();
      document.getElementById("map").src = newUrl;
    }
  });
});
