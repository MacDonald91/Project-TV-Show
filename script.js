let allShows = [];
let allEpisodes = [];
let episodeCache = {};
let currentView = "shows";

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
  currentView = "shows";

  const showsView = document.getElementById("showsView");
  const episodesView = document.getElementById("episodesView");

  showsView.innerHTML = "";
  showsView.style.display = "block";
  episodesView.style.display = "none";

  // reset state
  document.getElementById("showSearch").value = "";
  document.getElementById("episodeSearch").value = "";

  updateCount(list.length, allShows.length);

  list.forEach(show => {
    const card = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = show.name;
    title.style.cursor = "pointer";
    title.onclick = () => fetchEpisodes(show.id);

    const img = document.createElement("img");
    img.src = show.image?.medium || "";

    const summary = document.createElement("p");
    summary.textContent = stripHTML(show.summary || "");

    const meta = document.createElement("p");
    meta.textContent = `Genres: ${show.genres.join(", ")} | Status: ${show.status} | Rating: ${show.rating?.average || "N/A"} | Runtime: ${show.runtime}`;

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(meta);

    showsView.appendChild(card);
  });
}

// ---------- SHOW SEARCH ----------
function setupShowSearch() {
  const input = document.getElementById("showSearch");

  input.oninput = () => {
    if (currentView !== "shows") return;

    const term = input.value.toLowerCase();

    const filtered = allShows.filter(show =>
      show.name.toLowerCase().includes(term) ||
      show.genres.join(" ").toLowerCase().includes(term) ||
      stripHTML(show.summary || "").toLowerCase().includes(term)
    );

    renderShows(filtered);
  };
}

// ---------- FETCH EPISODES ----------
function fetchEpisodes(showId) {
  currentView = "episodes";

  const loading = document.getElementById("loading");
  loading.style.display = "block";

  document.getElementById("showSearch").value = "";

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
  const episodesView = document.getElementById("episodesView");

  showsView.style.display = "none";
  episodesView.style.display = "block";
  episodesView.innerHTML = "";

  document.getElementById("episodeSearch").value = "";

  updateCount(list.length, allEpisodes.length);

  list.forEach(ep => {
    const card = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = `${ep.name} - ${formatEpisodeCode(ep.season, ep.number)}`;

    const img = document.createElement("img");
    img.src = ep.image?.medium || "";

    const summary = document.createElement("p");
    summary.textContent = stripHTML(ep.summary || "");

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);

    episodesView.appendChild(card);
  });

  setupEpisodeSearch();
  setupEpisodeSelector();
}

// ---------- EPISODE SEARCH ----------
function setupEpisodeSearch() {
  const input = document.getElementById("episodeSearch");

  input.oninput = () => {
    if (currentView !== "episodes") return;

    const term = input.value.toLowerCase();

    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(term) ||
      stripHTML(ep.summary || "").toLowerCase().includes(term)
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

    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}`;

    select.appendChild(option);
  });

  select.onchange = () => {
    if (currentView !== "episodes") return;

    if (!select.value) {
      renderEpisodes(allEpisodes);
      return;
    }

    const selected = allEpisodes.filter(ep => ep.id == select.value);
    renderEpisodes(selected);
  };
}

// ---------- HOME BUTTON ----------
function setupHomeButton() {
  document.getElementById("homeBtn").onclick = () => {
    currentView = "shows";

    document.getElementById("showSearch").value = "";
    document.getElementById("episodeSearch").value = "";
    document.getElementById("episodeSelect").innerHTML = "<option>All Episodes</option>";

    renderShows(allShows);
  };
}

// ---------- HELPERS ----------
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

// XSS SAFE CLEANER
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

// ---------- COUNT ----------
function updateCount(current, total) {
  document.getElementById("count").textContent =
    `Displaying ${current} / ${total}`;
}

window.onload = setup;