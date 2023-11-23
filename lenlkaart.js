document.addEventListener('DOMContentLoaded', function() {
  const baseMapUrl = 'https://localfocuswidgets.net/655f6ee99d02c?hide=dropdowns';
  const areaSelectors = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad'];
  const skillSelectors = ['t', 'd', 'g'];

  // Functie om de selectors op de pagina te zetten
  function populateSelectors(selectorType, selectors) {
    const container = document.getElementById(`${selectorType}-selectors`);
    selectors.forEach(selector => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = selector;
      checkbox.value = selector;
      checkbox.dataset.type = selectorType;
      checkbox.addEventListener('change', updateMap); // Update de kaart bij wijziging
      const label = document.createElement('label');
      label.htmlFor = selector;
      label.textContent = selector.toUpperCase();
      container.appendChild(checkbox);
      container.appendChild(label);
    });
  }

  // Functie om de kaart URL te updaten
  function updateMap() {
    let url = baseMapUrl;
    const selectedAreas = document.querySelectorAll('#area-selectors input[type="checkbox"]:checked');
    const selectedSkills = document.querySelectorAll('#skill-selectors input[type="checkbox"]:checked');

    selectedAreas.forEach(area => {
      url += `&activate|geonaam=${area.value}`;
      if (selectedSkills.length === 0) {
        url += `&activate|selector=${area.value}`;
      }
    });

    selectedSkills.forEach(skill => {
      if (selectedAreas.length === 0) {
        url += `&activate|selector=${skill.value}`;
      } else {
        selectedAreas.forEach(area => {
          url += `&activate|selector=${area.value}${skill.value}`;
        });
      }
    });

    document.getElementById('map-frame').src = url; // Update de kaart iframe
    document.getElementById('generated-url').textContent = url; // Toon de gegenereerde URL
  }

  // Laad de selectors
  populateSelectors('area', areaSelectors);
  populateSelectors('skill', skillSelectors);
});
