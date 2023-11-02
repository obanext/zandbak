// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    var baseUrl = 'https://localfocuswidgets.net/6538ef99859c1?hide=dropdowns';
    var mapIframe = document.getElementById('map');
    var allAreasCheckbox = document.getElementById('all-areas');
    var checkboxes = document.querySelectorAll('.activiteit, .geonaam, .taalniveau, .digitaalniveau');
    
    // Function to update the map
    function updateMap() {
        var geonaamComponents = [];
        var selectorComponents = [];
        var allAreasSelected = allAreasCheckbox.checked;
        
        // If 'Alle Gebieden' is selected, include all areas and selectors
        if (allAreasSelected) {
            document.querySelectorAll('.geonaam').forEach(function(checkbox) {
                geonaamComponents.push(`&activate|geonaam=${checkbox.value}`);
                selectorComponents.push(`&activate|selector=${checkbox.value}`);
            });
        } else {
            // Collect selected geonaam and selectors
            document.querySelectorAll('.geonaam:checked').forEach(function(checkbox) {
                geonaamComponents.push(`&activate|geonaam=${checkbox.value}`);
                selectorComponents.push(`&activate|selector=${checkbox.value}`);
            });
            // Append activities to selectors if any
            document.querySelectorAll('.activiteit:checked').forEach(function(checkbox) {
                var activity = checkbox.dataset.activiteit;
                selectorComponents = selectorComponents.map(sc => `${sc}${activity}`);
            });
            // Append levels to selectors if any
            document.querySelectorAll('.taalniveau:checked, .digitaalniveau:checked').forEach(function(checkbox) {
                var level = checkbox.value;
                selectorComponents = selectorComponents.map(sc => `${sc}${level}`);
            });
        }

        // Combine all parts to construct the full URL
        var fullUrl = baseUrl + geonaamComponents.join('') + selectorComponents.join('');
        mapIframe.src = fullUrl; // Update the iframe src to the new URL
    }

    // Event listener for 'Alle Gebieden' which unchecks others if selected
    allAreasCheckbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach(function(checkbox) {
                if (checkbox !== allAreasCheckbox) {
                    checkbox.checked = false;
                }
            });
        }
        updateMap();
    });

    // Add event listeners to all other checkboxes
    checkboxes.forEach(function(checkbox) {
        if (checkbox !== allAreasCheckbox) { // Exclude 'Alle Gebieden' to prevent recursion
            checkbox.addEventListener('change', function() {
                if (allAreasCheckbox.checked) {
                    allAreasCheckbox.checked = false;
                }
                updateMap();
            });
        }
    });

    // Initial map update on load
    updateMap();
});
