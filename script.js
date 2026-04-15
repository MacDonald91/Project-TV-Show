function setup() {
  const rootElem = document.getElementById("root");

  // Show loading message
  rootElem.textContent = "Loading episodes...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((episodes) => {
      makePageForEpisodes(episodes);
    })
    .catch((error) => {
      rootElem.textContent =
        "Something went wrong while loading episodes. Please try again.";
      console.error(error);
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  const count = document.createElement("p");
  count.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.appendChild(count);

  // (You’ll expand this later — keep simple for now)
}

window.onload = setup;