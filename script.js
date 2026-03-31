function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear existing content
  rootElem.innerHTML = "";

  episodeList.forEach(function(episode) {

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    const episodeDiv = document.createElement("div");

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

window.onload = setup;