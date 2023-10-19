document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const taalOpties = document.querySelector(".taal-opties");
    const digitaalOpties = document.querySelector(".digitaal-opties");
    
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updateURL);
    });
    
    function updateURL() {
        const baseUrl = "https://localfocuswidgets.net/653118b473965?hide=dropdowns";
        const geonaamOptions = getSelectedOptions("geonaam-selector");
        const activiteitenSoortOptions = getSelectedOptions("activiteiten-soort");
        const taalOptions = getSelectedOptions("taal-opties");
        const digitaalOptions = getSelectedOptions("digitaal-opties");
        
        let url = baseUrl;
        
        if (geonaamOptions.length > 0) {
            // Gebruik dezelfde optie voor 'selector' als voor 'geonaam'
            const geoSelector = geonaamOptions.join('');
            url += `&activate|geonaam=${geoSelector}`;
            
            if (activiteitenSoortOptions.length > 0) {
                // Voeg de activiteiten-soort toe aan 'selector'
                url += `|${activiteitenSoortOptions.join('')}`;
            }
        } else if (activiteitenSoortOptions.length > 0) {
            // Geen 'geonaam' geselecteerd, gebruik alleen 'activiteiten-soort' voor 'selector'
            url += `&activate|selector=${activiteitenSoortOptions.join('')}`;
        }
        
        if (taalOptions.length > 0 && activiteitenSoortOptions.includes('t')) {
            url += `|${taalOptions[0]}`;
        }
        
        if (digitaalOptions.length > 0 && activiteitenSoortOptions.includes('d')) {
            url += `|${digitaalOptions[0]}`;
        }
        
        const iframe = document.querySelector(".map iframe");
        iframe.src = url;
        
        // Toon of verberg Taalopties op basis van Taal checkbox
        if (activiteitenSoortOptions.includes('t')) {
            taalOpties.style.display = "block";
        } else {
            taalOpties.style.display = "none";
        }
        
        // Toon of verberg Digitaalopties op basis van Digitaal checkbox
        if (activiteitenSoortOptions.includes('d')) {
            digitaalOpties.style.display = "block";
        } else {
            digitaalOpties.style.display = "none";
        }
    }
    
    function getSelectedOptions(optionName) {
        const selectedOptions = [];
        const checkboxes = document.querySelectorAll(`.${optionName} input[type='checkbox']:checked`);
        
        checkboxes.forEach(function (checkbox) {
            selectedOptions.push(checkbox.value);
        });
        
        return selectedOptions;
    }
});
