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

  // Dit is de nieuwe regel die ervoor zorgt dat de kaart initieel wordt bijgewerkt met alle gebieden geselecteerd.
  updateMap();
});
