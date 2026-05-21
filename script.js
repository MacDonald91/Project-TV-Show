let allEpisodes = [];

function setup() {
  fetchEpisodes();
}

function fetchEpisodes() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      loading.style.display = "none";

      allEpisodes = data;

      makePageForEpisodes(allEpisodes);
      setupSearch();
      setupSelector();
      updateCount(allEpisodes);
    })
    .catch((err) => {
      loading.style.display = "none";
      error.textContent = "Error loading episodes. Please try again.";
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");

    const code = formatEpisodeCode(episode.season, episode.number);

    card.innerHTML = `
      <h2>${episode.name} - ${code}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;

    rootElem.appendChild(card);
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();

    const filtered = allEpisodes.filter((ep) => {
      return (
        ep.name.toLowerCase().includes(term) ||
        ep.summary.toLowerCase().includes(term)
      );
    });

    makePageForEpisodes(filtered);
    updateCount(filtered);
  });
}

function setupSelector() {
  const select = document.getElementById("episodeSelect");

  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selected = select.value;

    if (!selected) {
      makePageForEpisodes(allEpisodes);
      updateCount(allEpisodes);
      return;
    }

    const result = allEpisodes.filter((ep) => ep.id == selected);

    makePageForEpisodes(result);
    updateCount(result);
  });
}

function updateCount(list) {
  const count = document.getElementById("episodeCount");
  count.textContent = `Displaying ${list.length} / ${allEpisodes.length} episodes`;
}

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

window.onload = setup;