function showOptions(activity) {
    const taalOptions = document.getElementById('taalOptions');
    const digitaalOptions = document.getElementById('digitaalOptions');

    // Verberg alle opties eerst
    taalOptions.style.display = 'none';
    digitaalOptions.style.display = 'none';

    // Toon de relevante opties op basis van de geselecteerde activiteit
    if (activity === 't') {
        taalOptions.style.display = 'block';
    } else if (activity === 'd') {
        digitaalOptions.style.display = 'block';
    }
}

document.getElementById('geo').addEventListener('change', updateURL);
document.getElementById('activiteiten').addEventListener('change', updateURL);
document.getElementById('taal').addEventListener('change', updateURL);
document.getElementById('digitaal').addEventListener('change', updateURL);

function updateURL() {
    const geo = document.getElementById('geo').value;
    const activiteit = document.getElementById('activiteiten').value;
    let taal = '';
    let digitaal = '';

    if (activiteit === 't') {
        taal = document.getElementById('taal').value;
    } else if (activiteit === 'd') {
        digitaal = document.getElementById('digitaal').value;
    }

    const url = `https://localfocuswidgets.net/653113dfcf53f?hide=dropdowns&activate|geo=${geo}&activate|aa=${geo}${activiteit}${taal}${digitaal}`;
    document.getElementById('kaart').src = url;
}
