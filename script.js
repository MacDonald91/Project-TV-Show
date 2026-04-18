let allEpisodes = [];
let showsCache = [];
let episodesCache = {};

function setup() {
  const root = document.getElementById("root");
  root.textContent = "Loading shows...";

  fetch("https://api.tvmaze.com/shows")
    .then((res) => res.json())
    .then((shows) => {
      showsCache = shows;

      populateShowSelector(showsCache);
      loadShowEpisodes(showsCache[0].id);
    })
    .catch(() => {
      root.textContent = "Error loading shows";
    });
}

window.onload = setup;

// -------------------- SHOW SELECTOR --------------------
function populateShowSelector(shows) {
  const selector = document.getElementById("show-selector");

  selector.innerHTML = "";

  // IMPORTANT: sort BEFORE rendering
  shows
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      selector.appendChild(option);
    });

  selector.onchange = (e) => {
    loadShowEpisodes(e.target.value);
  };
}
// -------------------- LOAD EPISODES --------------------
function loadShowEpisodes(showId) {
  const root = document.getElementById("root");
  root.textContent = "Loading episodes...";

  // reset UI state (IMPORTANT)
  document.getElementById("search-input").value = "";
  document.getElementById("episode-selector").innerHTML =
    `<option value="all">All Episodes</option>`;

  document.getElementById("show-selector").value = showId;

  // CACHE CHECK (IMPORTANT: no duplicate fetch)
  if (episodesCache[showId]) {
    allEpisodes = episodesCache[showId];
    populateEpisodeSelector(allEpisodes);
    makePageForEpisodes(allEpisodes);

    setupSearch();
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((episodes) => {
      allEpisodes = episodes;
      episodesCache[showId] = episodes;

      populateEpisodeSelector(allEpisodes);
      makePageForEpisodes(allEpisodes);

      setupSearch();
    })
    .catch(() => {
      root.textContent = "Error loading episodes";
    });
}

function populateEpisodeSelector(episodes) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = `<option value="all">All Episodes</option>`;

  episodes.forEach((ep) => {
    const option = document.createElement("option");

    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");

    option.value = ep.id;
    option.textContent = `S${season}E${number} - ${ep.name}`;

    selector.appendChild(option);
  });

  selector.onchange = handleEpisodeSelect;
}

function handleEpisodeSelect(event) {
  document.getElementById("search-input").value = "";
  const selectedId = event.target.value;

  if (selectedId === "all") {
    makePageForEpisodes(allEpisodes);
  } else {
    const selected = allEpisodes.filter((ep) => ep.id == selectedId);
    makePageForEpisodes(selected);
  }
}

function setupSearch() {
  const input = document.getElementById("search-input");

  input.oninput = () => {
    const searchTerm = input.value.toLowerCase();

    const filtered = allEpisodes.filter((ep) => {
      return (
        ep.name.toLowerCase().includes(searchTerm) ||
        (ep.summary || "").toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filtered);
  };
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");
  const count = document.getElementById("count");

  root.innerHTML = "";

  if (episodeList.length === 0) {
    root.textContent = "No episodes found";
    return;
  }

  count.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;

  episodeList.forEach((ep) => {
    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${ep.name} - ${code}</h3>
       ${ep.image?.medium ? `<img src="${ep.image.medium}" alt="${ep.name}">` : ""}
      <p>${ep.summary ? ep.summary.replace(/<[^>]*>/g, "") : "No summary available"}</p>

    `;

    root.appendChild(card);
  });
}

window.onload = setup;
