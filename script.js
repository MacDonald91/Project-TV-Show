let allEpisodes = [];

function setup() {
  const root = document.getElementById("root");
  root.textContent = "Loading episodes...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((res) => res.json())
    .then((episodes) => {
      allEpisodes = episodes;

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

  episodes.forEach((ep) => {
    const option = document.createElement("option");

    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    selector.appendChild(option);
  });

  selector.addEventListener("change", handleEpisodeSelect);
}

function handleEpisodeSelect(event) {
  const selectedId = event.target.value;

  if (selectedId === "all") {
    makePageForEpisodes(allEpisodes);
  } else {
    const selected = allEpisodes.filter(
      (ep) => ep.id == selectedId
    );
    makePageForEpisodes(selected);
  }
}

function setupSearch() {
  const input = document.getElementById("search-input");

  input.addEventListener("input", () => {
    const searchTerm = input.value.toLowerCase();

    const filtered = allEpisodes.filter((ep) => {
      return (
        ep.name.toLowerCase().includes(searchTerm) ||
        ep.summary.toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filtered);
  });
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");
  const count = document.getElementById("count");

  root.innerHTML = "";

  count.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;

  episodeList.forEach((ep) => {
    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${ep.name} - ${code}</h3>
      <img src="${ep.image.medium}" />
      <p>${ep.summary}</p>
    `;

    root.appendChild(card);
  });
}

window.onload = setup;