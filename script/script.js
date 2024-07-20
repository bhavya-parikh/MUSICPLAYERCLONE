console.log("lets write js");
let currentSong = new Audio();
let songs;
let currfolder;

const baseURL = "./";

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let response = await fetch(`${baseURL}/${folder}/songs.json`);
  let data = await response.json();
  songs = data.songs;

  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `<li>
                            <img class="invert" src="${baseURL}/img/music.svg" alt="">
                            <div class="info">
                                <div>${song
                                  .replaceAll("%20", " ")
                                  .replaceAll("%24", "$")}</div>
                                <div>Janak X sad</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="${baseURL}/img/playbutton.svg" alt="">
                            </div>
                         </li>`;
  }

  Array.from(document.querySelectorAll(".songlist li")).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info div").innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${baseURL}/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    document.querySelector("#play").src = `${baseURL}/img/pause.svg`;
  }
  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00";
};

async function displayAlbums() {
  const albums = ["ncs", "punjabi"];
  let cardContainer = document.querySelector(".cardContainer");

  for (const folder of albums) {
    let response = await fetch(`${baseURL}/songs/${folder}/info.json`);
    let data = await response.json();
    cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                                  <div class="play">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" class="play-icon">
                                          <circle cx="25" cy="25" r="24" />
                                          <g class="play-shape">
                                              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                                          </g>
                                      </svg>
                                  </div>
                                  <img src="${baseURL}/songs/${folder}/cover.jpg" onerror="this.onerror=null; this.src='${baseURL}/songs/${folder}/cover.jpeg';" alt="">
                                  <h2>${data.title}</h2>
                                  <p>${data.description}</p>
                                </div>`;
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  displayAlbums();

  document.querySelector("#play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.querySelector("#play").src = `${baseURL}/img/pause.svg`;
    } else {
      currentSong.pause();
      document.querySelector("#play").src = `${baseURL}/img/playbutton.svg`;
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 99 + "%";
  });

  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  document.querySelector("#previous").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector("#next").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document.querySelector(".range input").value = 10;
    }
  });
}

main();
