document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    
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
            url += `&activate|geonaam=${geonaamOptions.join('')}`;
        }
        
        if (activiteitenSoortOptions.length > 0) {
            url += `&activate|selector=${activiteitenSoortOptions.join('')}`;
        }
        
        if (taalOptions.length > 0 && activiteitenSoortOptions.includes('t')) {
            url += `|${taalOptions[0]}`;
        }
        
        if (digitaalOptions.length > 0 && activiteitenSoortOptions.includes('d')) {
            url += `|${digitaalOptions[0]}`;
        }
        
        window.location.href = url;
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
