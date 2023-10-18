document.addEventListener('DOMContentLoaded', () => {
  const locationCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  const postcodeInput = document.getElementById('postcode');

  locationCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateMap);
  });

  postcodeInput.addEventListener('input', updateMap);

  function generateUrl() {
    const locationParams = {
      Centrum: 'ac',
      Noord: 'an',
      Zuid: 'az',
      Zuidoost: 'azo',
      'Nieuw-West': 'anw',
      West: 'aw',
      Oost: 'ao',
    };

    const locationGeoParams = {
      Centrum: 'c',
      Noord: 'n',
      Zuid: 'z',
      Zuidoost: 'zo',
      'Nieuw-West': 'nw',
      West: 'w',
      Oost: 'o',
    };

    const categoryParams = {
      taal: 't',
      geld: 'g',
      digitaal: 'd',
    };

    const selectedLocations = Array.from(locationCheckboxes)
      .filter((checkbox) => checkbox.checked && locationParams.hasOwnProperty(checkbox.value))
      .map((checkbox) => locationParams[checkbox.value]);

    const selectedGeoLocations = Array.from(locationCheckboxes)
      .filter((checkbox) => checkbox.checked && locationGeoParams.hasOwnProperty(checkbox.value))
      .map((checkbox) => locationGeoParams[checkbox.value]);

    const selectedCategories = Array.from(locationCheckboxes)
      .filter((checkbox) => checkbox.checked && categoryParams.hasOwnProperty(checkbox.value))
      .map((checkbox) => categoryParams[checkbox.value]);

    const postcode = postcodeInput.value;

    const allLocations = Object.values(locationParams);

    const activateParams = selectedLocations.length === 0 ? allLocations : selectedLocations;
    const queryParams = new URLSearchParams();

    queryParams.append('hide', 'dropdowns');

    if (postcode) queryParams.append('postcode', postcode);

    const mapUrl = 'https://localfocuswidgets.net/64521d8435e0f';
    const combinations = [];

    for (const location of activateParams) {
      const categories = selectedCategories.length === 0 ? [''] : selectedCategories;
      for (const category of categories) {
        combinations.push(`${location}${category}`);
      }
    }

    for (const combination of combinations) {
      queryParams.append('activate|sa', combination);
    }

    for (const geoLocation of selectedGeoLocations) {
      queryParams.append('activate|geo', geoLocation);
    }

    return `${mapUrl}?${queryParams.toString()}`;
  }

  function updateMap() {
    document.getElementById('map').src = generateUrl();
  }
});


// Toegevoegde functie om de weergave van opties te beheren
function toggleOptions(checkbox, optionsId) {
  const optionsElement = document.getElementById(optionsId);
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      optionsElement.style.display = "block";
    } else {
      optionsElement.style.display = "none";
    }
  

  // Functie om de zichtbaarheid van optiecontainers te schakelen
  function toggleOptionContainer(checkboxElement, containerId) {
    const container = document.getElementById(containerId);
    checkboxElement.addEventListener('change', function() {
      if (this.checked) {
        container.style.display = 'block'; // Als aangevinkt, toon de container
      } else {
        container.style.display = 'none';  // Als niet aangevinkt, verberg de container
      }
    });
  }

  // Vind de checkboxes en pas de toggle-functie toe
  const taalCheckbox = document.querySelector('input[value="taal"]');
  const digitaalCheckbox = document.querySelector('input[value="digitaal"]');
  
  // Roep de toggle-functie aan met de juiste elementen en IDs
  toggleOptionContainer(taalCheckbox, 'language-options');
  toggleOptionContainer(digitaalCheckbox, 'digital-options');

});
}

// Vind de checkboxes
const taalCheckbox = document.querySelector('input[value="taal"]');
const geldCheckbox = document.querySelector('input[value="geld"]');

// Roep de functie aan voor beide sets van opties
toggleOptions(taalCheckbox, 'taalOptions');
toggleOptions(geldCheckbox, 'geldOptions');
