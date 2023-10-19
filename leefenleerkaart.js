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
            url += `&activate|geonaam=${geonaamOptions.join('')}`;
        }
        
        if (activiteitenSoortOptions.length > 0) {
            url += `&activate|selector=${geonaamOptions.join('')}${activiteitenSoortOptions.join('')}`;
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
        if (activiteitenSoort
