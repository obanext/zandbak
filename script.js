const api_url_base = "https://cors-anywhere.herokuapp.com/https://zoeken.oba.nl/api/v1/search/?q=";
const api_key = "&authorization=d7519ea81ad4e06ab5e5dac46ddeb63a";
const api_output = "&output=json";
const api_pagesize = "&pagesize=5";

async function getResults(searchTerm, facet = "") {
  const api_url = api_url_base + searchTerm + facet + api_pagesize + api_key + api_output;

  try {
    const response = await fetch(api_url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      console.error("Error fetching data:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function showResults(category, results) {
  const resultsContainer = document.getElementById(category + "Results");
  resultsContainer.innerHTML = "";

  results.forEach((result) => {
    const img = document.createElement("img");
    let imageUrl = '';

    if (result.coverimages && result.coverimages[1]) {
      imageUrl = result.coverimages[1];
    } else if (result.coverimages && result.coverimages[0]) {
      imageUrl = result.coverimages[0].replace('{0}', 'l');
    } else {
      imageUrl = 'fallback.png';
    }

    img.src = imageUrl;
    img.alt = result.titles[0];
    img.onerror = function () {
      this.onerror = null;
      this.src = "fallback.png";
    };

    let detailLink = result.detailLink;
    if (!detailLink) {
      detailLink = result.detaillink;
    }

    const link = document.createElement("a");
    link.href = detailLink.replace("http:", "https:");
    link.target = "_blank";
    link.appendChild(img);

    const item = document.createElement("div");
    item.className = "result-item";
    item.appendChild(link);

    resultsContainer.appendChild(item);
  });
}
async function search() {
  const searchTerm = document.getElementById("searchTerm").value.trim();

  if (searchTerm.length === 0) {
    return;
  }

  categoryContainers.forEach((container) => {
    container.style.display = "none";
  });

  chatMessages.innerHTML += '<div class="chat-message user"><span>' + searchTerm + '</span></div>';

  const categories = [
    { name: "boeken", facet: "&facet=type(book)&refine=true" },
    { name: "dvds", facet: "&facet=type(movie)&refine=true" },
    { name: "activiteiten", facet: "%20table:Activiteiten&refine=true" },
    { name: "cursussen", facet: "%20table:jsonsrc&refine=true" },
  ];

  for (const category of categories) {
    const results = await getResults(searchTerm, category.facet);
    if (results.length > 0) {
      showResults(category.name, results);
      document.getElementById(category.name + "Container").style.display = "block";
    } else {
      document.getElementById(category.name + "Container").style.display = "none";
    }
  }

chatMessages.innerHTML += '<div class="chat-message bot"><span>Hier zijn de resultaten van je zoekvraag voor <a href="#" onclick="reissueSearch(\'' + searchTerm + '\')">' + searchTerm + '</a>. Kan ik nog iets voor je zoeken?</span></div>';

  const keywords = ["openingstijden", "open", "geopend"];
  if (keywords.some((word) => searchTerm.toLowerCase().includes(word.toLowerCase()))) {
    const editorialResults = await getResults("format:oba.nl%20" + searchTerm, "", "&pagesize=1");
    if (editorialResults.length > 0) {
      const editorialResult = editorialResults[0];
      const summary = editorialResult.summaries[0];
      const detailLink = editorialResult.detailLink;
      chatMessages.innerHTML += `<div class="chat-message bot"><span>${summary} <a href="${detailLink}" target="_blank">Meer</a></span></div>`;
    } else {
      chatMessages.innerHTML += '<div class="chat-message bot"><span>Geen redactionele inhoud gevonden. Kan ik nog iets voor je zoeken?</span></div>';
    }
  }

  chatBody.scrollTop = chatBody.scrollHeight;
}


function reissueSearch(searchTerm) {
  document.getElementById("searchTerm").value = searchTerm;
  search();
}

document.getElementById("searchButton").addEventListener("click", () => {
  search();
  document.getElementById("searchTerm").value = "";
});

document.getElementById("searchTerm").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search();
    document.getElementById("searchTerm").value = "";
  }
});


const categoryContainers = document.querySelectorAll(".category-container");
categoryContainers.forEach((container) => {
  container.style.display = "none";
});

const chatMessages = document.getElementById("chatMessages");
const chatBody = document.querySelector(".chat-body");
