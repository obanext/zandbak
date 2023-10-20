document.addEventListener('DOMContentLoaded', function() {
    // Functie om de zichtbaarheid van taal- en digitaalopties te regelen
    function manageOptionsVisibility() {
        var taalCheckbox = document.querySelector("#t");
        var digitaalCheckbox = document.querySelector("#d");
        var taalOpties = document.querySelector(".taal-opties");
        var digitaalOpties = document.querySelector(".digitaal-opties");

        // Controleer de status van de checkboxes en pas de zichtbaarheid van de opties aan
        taalOpties.style.display = taalCheckbox.checked ? 'block' : 'none';
        digitaalOpties.style.display = digitaalCheckbox.checked ? 'block' : 'none';
    }

    // Voeg event listeners toe aan de "Taal" en "Digitaal" checkboxes
    document.querySelector("#t").addEventListener('change', manageOptionsVisibility);
    document.querySelector("#d").addEventListener('change', manageOptionsVisibility);
});
