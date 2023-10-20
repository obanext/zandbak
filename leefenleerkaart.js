document.addEventListener("DOMContentLoaded", function() {
    // Functie om de zichtbaarheid van de opties te schakelen
    function toggleOptions(checkboxId, optionsId) {
        var checkbox = document.getElementById(checkboxId);
        var options = document.getElementById(optionsId);

        checkbox.addEventListener("change", function() {
            options.style.display = checkbox.checked ? "block" : "none";
        });
    }

    // Taal en Digitaal opties in-/uitklappen
    toggleOptions("t", "taal-options");
    toggleOptions("d", "digitaal-options");
});
