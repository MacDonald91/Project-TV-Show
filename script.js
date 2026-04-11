let allEpisodes = [];
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  createSearchBox();
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear existing content
  rootElem.innerHTML = "";

  episodeList.forEach(function (episode) {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    const episodeDiv = document.createElement("div");
    episodeDiv.className = "card";

    episodeDiv.innerHTML = `
  <h2>${episode.name}</h2>
  <p>${episodeCode}</p>
  <p>Season: ${episode.season}</p>
  <p>Episode: ${episode.number}</p>
  <img src="${episode.image.medium}" />
  <p>${episode.summary}</p>
`;

    rootElem.appendChild(episodeDiv);
  });
}
function createSearchBox() {
  const rootElem = document.getElementById("root");

  const container = document.createElement("div");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search episodes...";

  const counter = document.createElement("p");

  container.appendChild(input);
  container.appendChild(counter);

  document.body.insertBefore(container, rootElem);

  input.addEventListener("input", function () {
    const searchTerm = input.value.toLowerCase();

    const filtered = allEpisodes.filter(function (episode) {
      const name = episode.name.toLowerCase();
      const summary = episode.summary.toLowerCase();

      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    makePageForEpisodes(filtered);

    counter.textContent = `${filtered.length} / ${allEpisodes.length} episodes`;
  });
}

window.onload = setup;
