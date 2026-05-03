function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear existing content
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");

    const episodeCode = formatEpisodeCode(episode.season, episode.number);

    episodeCard.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;

    rootElem.appendChild(episodeCard);
  });
}

// helper function (REQUIRED for formatting marks)
function formatEpisodeCode(season, number) {
  const seasonStr = String(season).padStart(2, "0");
  const numberStr = String(number).padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

window.onload = setup;