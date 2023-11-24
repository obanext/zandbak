document.addEventListener('DOMContentLoaded', function() {
  const baseMapUrl = 'https://localfocuswidgets.net/65603ea3927e4';
  const areaSelectors = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad'];
  const skillSelectors = ['t', 'd', 'g'];

  function populateSelectors(selectorType, selectors, containerId) {
    const container = document.getElementById(containerId);
    selectors.forEach(selector => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = selector;
      checkbox.value = selector;
      checkbox.dataset.type = selectorType;
      checkbox.addEventListener('change', updateMap); // Update map on change
      const label = document.createElement('label');
      label.htmlFor = selector;
      label.textContent = selector.toUpperCase();
      container.appendChild(label);
      container.appendChild(checkbox);
    });
  }

  function updateMap() {
    let url = baseMapUrl;
    const selectedAreas = Array.from(document.querySelectorAll('#area-selectors input[type="checkbox"]:checked')).map(el => el.value);
    const selectedSkills = Array.from(document.querySelectorAll('#skill-selectors input[type="checkbox"]:checked')).map(el => el.value);

    // If there are no selections made, then default to loading all areas and selectors
    if (selectedAreas.length === 0 && selectedSkills.length === 0) {
      areaSelectors.forEach(area => {
        url += `&activate|geonaam=${area}&activate|selector=${area}`;
      });
    } else {
      // Add only the selected areas to the URL
      selectedAreas.forEach(area => {
        url += `&activate|geonaam=${area}`;
      });

      // If skills are selected but no areas, add all areas with selected skills
      if (selectedSkills.length > 0 && selectedAreas.length === 0) {
        areaSelectors.forEach(area => {
          selectedSkills.forEach(skill => {
            url += `&activate|selector=${area}${skill}`;
          });
        });
      }
      // If areas are selected but no skills, add each selected area with its selector
      else if (selectedSkills.length === 0 && selectedAreas.length > 0) {
        selectedAreas.forEach(area => {
          url += `&activate|selector=${area}`;
        });
      }
      // If both areas and skills are selected, append them to the URL
      else {
        selectedSkills.forEach(skill => {
          selectedAreas.forEach(area => {
            url += `&activate|selector=${area}${skill}`;
          });
        });
      }
    }

    // Update iframe source and display URL
    document.getElementById('map-frame').src = url;
    document.getElementById('generated-url').textContent = url;
  }

  // Populate selectors on load without selecting them
  populateSelectors('area', areaSelectors, 'area-selectors');
  populateSelectors('skill', skillSelectors, 'skill-selectors');

  // Call updateMap on page load to set the initial state with all areas and skills
  updateMap();
});
