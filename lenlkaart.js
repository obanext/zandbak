document.addEventListener('DOMContentLoaded', function() {
  const baseMapUrl = 'https://localfocuswidgets.net/655f6ee99d02c?hide=dropdowns';
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

    // Append areas and skills to the URL
    selectedAreas.forEach(area => {
      url += `&activate|geonaam=${area}`;
      selectedSkills.forEach(skill => {
        url += `&activate|selector=${area}${skill}`;
      });
    });

    // If no areas are selected but skills are, append skills only
    if (selectedAreas.length === 0) {
      selectedSkills.forEach(skill => {
        url += `&activate|selector=${skill}`;
      });
    }

    // Update iframe source and display URL
    document.getElementById('map-frame').src = url;
    document.getElementById('generated-url').textContent = url;
  }

  // Populate selectors on load
  populateSelectors('area', areaSelectors, 'area-selectors');
  populateSelectors('skill', skillSelectors, 'skill-selectors');
});
