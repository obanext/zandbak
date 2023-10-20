document.addEventListener("DOMContentLoaded", function() {
    function toggleOptions(checkboxId, optionsId) {
        var checkbox = document.getElementById(checkboxId);
        var options = document.getElementById(optionsId);

        // Stel de initiële display-status in op basis van de checkbox-status
        options.style.display = checkbox.checked ? "block" : "none";

        // Voeg een event listener toe voor wijzigingen
        checkbox.addEventListener("change", function() {
            options.style.display = checkbox.checked ? "block" : "none";
        });
    }

    // Initialisatie van de toggle-functie voor de relevante elementen
    toggleOptions("t", "taal-options");
    toggleOptions("d", "digitaal-options");
});
