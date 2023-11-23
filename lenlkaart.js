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
      const label = document.createElement('label');
      label.htmlFor = selector;
      label.textContent = selector.toUpperCase();
      container.appendChild(checkbox);
      container.appendChild(label);
    });
  }

  // Functie om de URL te bouwen en te tonen op basis van geselecteerde waarden
  function generateMapUrl() {
    let url = baseMapUrl;
    const selectedAreas = document.querySelectorAll('#area-selectors input[type="checkbox"]:checked');
    const selectedSkills = document.querySelectorAll('#skill-selectors input[type="checkbox"]:checked');

    selectedAreas.forEach(area => {
      url += `&activate|geonaam=${area.value}`;
      if (selectedSkills.length === 0) { // Als geen vaardigheden zijn geselecteerd
        url += `&activate|selector=${area.value}`;
      }
    });

    selectedSkills.forEach(skill => {
      if (selectedAreas.length === 0) { // Als geen gebieden zijn geselecteerd
        url += `&activate|selector=${skill.value}`;
      } else {
        selectedAreas.forEach(area => {
          url += `&activate|selector=${area.value}${skill.value}`;
        });
      }
    });

    // Update de kaart iframe en toon de URL
    document.getElementById('map-frame').src = url;
    document.getElementById('generated-url').value = url; // Toon de gegenereerde URL in het tekstveld
  }

  // Event listeners
  document.getElementById('generate-url').addEventListener('click', generateMapUrl);

  // Laad de selectors
  populateSelectors('area', areaSelectors);
  populateSelectors('skill', skillSelectors);
});
