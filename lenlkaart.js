document.addEventListener('DOMContentLoaded', function () {
    const baseMapUrl = 'https://localfocuswidgets.net/656828b5aa7c9?hide=dropdowns';
    const areaSelectors = ['ac', 'an', 'az', 'azo', 'anw', 'aw', 'ao', 'awe', 'ad'];
    const skillSelectors = ['T', 'd', 'g'];

    const areaLabels = {
        ac: 'Centrum',
        an: 'Noord',
        az: 'Zuid',
        azo: 'Zuidoost',
        anw: 'Nieuw-West',
        aw: 'West',
        ao: 'Oost',
        awe: 'Weesp',
        ad: 'Diemen'
    };

    const skillLabels = {
        T: 'Taal',
        d: 'Computer',
        g: 'Geld en Rekenen'
    };

    function populateSelectors(selectorType, selectors, containerId, labels) {
        const container = document.getElementById(containerId);
        selectors.forEach(selector => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = selector;
            checkbox.value = selector;
            checkbox.dataset.type = selectorType;
            checkbox.addEventListener('change', updateMap);
            const label = document.createElement('label');
            label.htmlFor = selector;
            label.textContent = labels[selector];
            container.appendChild(label);
            container.appendChild(checkbox);
        });
    }

    function updateMap() {
        let url = baseMapUrl;
        const selectedAreas = Array.from(document.querySelectorAll('#area-selectors input[type="checkbox"]:checked')).map(el => el.value);
        const selectedSkills = Array.from(document.querySelectorAll('#skill-selectors input[type="checkbox"]:checked')).map(el => el.value);

        if (selectedAreas.length === 0 && selectedSkills.length === 0) {
            areaSelectors.forEach(area => {
                url += `&activate|geonaam=${area}&activate|selector=${area}`;
            });
        } else {
            selectedAreas.forEach(area => {
                url += `&activate|geonaam=${area}`;
            });

            if (selectedSkills.length > 0 && selectedAreas.length === 0) {
                areaSelectors.forEach(area => {
                    url += `&activate|geonaam=${area}`;
                    selectedSkills.forEach(skill => {
                        url += `&activate|selector=${area}${skill}`;
                    });
                });
            } else if (selectedSkills.length === 0 && selectedAreas.length > 0) {
                selectedAreas.forEach(area => {
                    url += `&activate|selector=${area}`;
                });
            } else {
                selectedSkills.forEach(skill => {
                    selectedAreas.forEach(area => {
                        url += `&activate|selector=${area}${skill}`;
                    });
                });
            }
        }

        document.getElementById('map-frame').src = url;
        document.getElementById('generated-url').textContent = url;
    }

    populateSelectors('area', areaSelectors, 'area-selectors', areaLabels);
    populateSelectors('skill', skillSelectors, 'skill-selectors', skillLabels);

    updateMap();
});
