let allShows = [];
let allEpisodes = [];
let episodeCache = {};

function setup() {
  fetchShows();
  setupHomeButton();
}

// ---------- FETCH SHOWS ----------
function fetchShows() {
  fetch("https://api.tvmaze.com/shows")
    .then(res => res.json())
    .then(data => {
      allShows = data;
      renderShows(allShows);
      setupShowSearch();
    })
    .catch(() => {
      document.getElementById("error").textContent = "Error loading shows";
    });
}

// ---------- SHOWS VIEW ----------
function renderShows(list) {
  const container = document.getElementById("showsView");
  const episodesView = document.getElementById("episodesView");

  container.innerHTML = "";
  episodesView.style.display = "none";
  container.style.display = "block";

  list.forEach(show => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h2 class="showTitle" data-id="${show.id}">${show.name}</h2>
      <img src="${show.image?.medium || ""}">
      <p>${show.summary || ""}</p>
      <p>Genres: ${show.genres.join(", ")}</p>
      <p>Status: ${show.status}</p>
      <p>Rating: ${show.rating?.average || "N/A"}</p>
      <p>Runtime: ${show.runtime} mins</p>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".showTitle").forEach(el => {
    el.addEventListener("click", () => {
      fetchEpisodes(el.dataset.id);
    });
  });
}

// ---------- SHOW SEARCH ----------
function setupShowSearch() {
  const input = document.getElementById("showSearch");

  input.oninput = () => {
    const term = input.value.toLowerCase();

    const filtered = allShows.filter(show =>
      show.name.toLowerCase().includes(term) ||
      show.genres.join(" ").toLowerCase().includes(term) ||
      (show.summary || "").toLowerCase().includes(term)
    );

    renderShows(filtered);
  };
}

// ---------- FETCH EPISODES ----------
function fetchEpisodes(showId) {
  const loading = document.getElementById("loading");

  loading.style.display = "block";

  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    loading.style.display = "none";
    renderEpisodes(allEpisodes);
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(res => res.json())
    .then(data => {
      episodeCache[showId] = data;
      allEpisodes = data;
      loading.style.display = "none";
      renderEpisodes(allEpisodes);
    })
    .catch(() => {
      loading.style.display = "none";
      document.getElementById("error").textContent = "Error loading episodes";
    });
}

// ---------- EPISODES VIEW ----------
function renderEpisodes(list) {
  const showsView = document.getElementById("showsView");
  const container = document.getElementById("episodesView");

  showsView.style.display = "none";
  container.style.display = "block";

  container.innerHTML = "";

  list.forEach(ep => {
    const card = document.createElement("div");

    const code = formatEpisodeCode(ep.season, ep.number);

    card.innerHTML = `
      <h2>${ep.name} - ${code}</h2>
      <img src="${ep.image?.medium || ""}">
      <p>${ep.summary || ""}</p>
    `;

    container.appendChild(card);
  });

  setupEpisodeSearch();
  setupEpisodeSelector();
  updateCount(list);
}

// ---------- EPISODE SEARCH ----------
function setupEpisodeSearch() {
  const input = document.getElementById("episodeSearch");

  input.oninput = () => {
    const term = input.value.toLowerCase();

    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(term) ||
      (ep.summary || "").toLowerCase().includes(term)
    );

    renderEpisodes(filtered);
  };
}

// ---------- EPISODE SELECT ----------
function setupEpisodeSelector() {
  const select = document.getElementById("episodeSelect");

  select.innerHTML = `<option value="">All Episodes</option>`;

  allEpisodes.forEach(ep => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    select.appendChild(option);
  });

  select.onchange = () => {
    if (!select.value) {
      renderEpisodes(allEpisodes);
      return;
    }

    const selected = allEpisodes.filter(ep => ep.id == select.value);
    renderEpisodes(selected);
  };
}

// ---------- COUNT ----------
function updateCount(list) {
  document.getElementById("count").textContent =
    `Displaying ${list.length} / ${allEpisodes.length}`;
}

// ---------- HOME BUTTON ----------
function setupHomeButton() {
  document.getElementById("homeBtn").onclick = () => {
    renderShows(allShows);
  };
}

// ---------- FORMAT ----------
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

window.onload = setup;