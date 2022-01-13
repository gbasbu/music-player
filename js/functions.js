// Toggle List
let up = document.querySelector("#up");
let down = document.querySelector("#down");
let musicList = document.querySelector("#music-list");

up.addEventListener("click", function () {
  up.classList.add("hidden");
  down.classList.remove("hidden");
  musicList.classList.add("listHidden");
});

down.addEventListener("click", function () {
  down.classList.add("hidden");
  up.classList.remove("hidden");
  musicList.classList.remove("listHidden");
});


let songElements = document.getElementsByClassName("song");

for (let i = 0; i < songElements.length; i++) {
  /*
		Show and hide the play button container on the song when the song is clicked.
	*/
  songElements[i].addEventListener("click", function () {
    this.querySelectorAll(".play-button-container")[0].style.display = "none";
    console.log(songElements[i]);
  });
}

let play = document.querySelector(".amplitude-play-pause");

play.addEventListener("click", function () {
  let activeSong = document.querySelector(".amplitude-active-song-container");
  //console.log(activeSong);
});

/*
	Initializes AmplitudeJS
*/

let addlist = [];
const xhr = new XMLHttpRequest();
xhr.open("GET", "../db.json", true);
xhr.onload = function () {
  if (this.status === 200) {
    let songs = JSON.parse(this.responseText);
    //console.log(songs[0].url.duration);

    songs.forEach((d) => {
      addlist += `
            <div class="bg-gray-900/80 mb-1 py-1 px-8 cursor-pointer song amplitude-song-container amplitude-play-pause amplitude-paused amplitude-active-song-container flex" data-amplitude-song-index="${d.id}" >
            <div class="song-now-playing-icon-container float-left w-[20px] h-[20px] mr-[10px]">
              <div class="play-button-container hidden w-[22px] h-[22px] mt-[10px]"></div>
              <img class="now-playing hidden mt-[15px]" src="./img/now-playing.svg" alt="">
            </div>
            <div class="song-meta-data">
              <span class="song-title text-white text-[16px] block font-light whitespace-nowrap overflow-hidden text-ellipsis">${d.songName}</span>
              <span class="song-artist text-[14px] font-bold text-upperccase block whitespace-nowrap overflow-hidden text-ellipsis">${d.artistName}</span>
            </div>
          </div>
            `;
      document.getElementById("amplitude-right").innerHTML = addlist;
    });

    let music = [];
    songs.forEach(function (d) {
      let song = {
        artist: d.artistName,
        name: d.songName,
        cover_art_url: d.albumArt,
        url: d.videoUrl,
        repeat: d.repeat
      };
      music.push(song);
    });

    Amplitude.init({
      songs: music,
      volume: 50,
      debug: true,
      callbacks: {
        next: function () {
          let songMeta = Amplitude.getActiveSongMetadata();
          let videoSource = document.querySelector("#video-source");
          let video = document.querySelector("#video");
          videoSource.src = songMeta.url;
          video.load();
          fetchVideoAndPlay(songMeta);
          // Repeat next song 'x' times
          if(repeat == true){
            repeatTime++
            if(repeatTime == parseInt(songMeta.repeat)){
              // Reset repeat and repeatTime
              repeat = false
              repeatTime = 0
              // Display repeat buttons
              repeatOff.classList.remove('hidden')
              repeatOn.classList.add('hidden')
              Amplitude.setRepeatSong(repeat)
            }
          }else{
            repeatTime = 0
            if(songMeta.repeat > 0){
              repeat = true
              repeatOff.classList.add('hidden')
              repeatOn.classList.remove('hidden')
              Amplitude.setRepeatSong(repeat)
            }
            
          }
        },
        prev: function () {
          let songMeta = Amplitude.getActiveSongMetadata();
          let videoSource = document.querySelector("#video-source");
          let video = document.querySelector("#video");
          videoSource.src = songMeta.url;
          video.load();
          fetchVideoAndPlay(songMeta);
          
        },
        song_change: function () {
          let songMeta = Amplitude.getActiveSongMetadata();
          let videoSource = document.querySelector("#video-source");
          let video = document.querySelector("#video");
          videoSource.src = songMeta.url;
          video.load();
          fetchVideoAndPlay(songMeta);
          
        },
        loadedmetadata: function () {
          let songMeta = Amplitude.getActiveSongMetadata();
          let videoSource = document.querySelector("#video-source");
          let video = document.querySelector("#video");
          videoSource.src = songMeta.url;
          video.load();
        },
        // First song repeat feature
        initialized: function() {
          let songMeta = Amplitude.getActiveSongMetadata();
          if(parseInt(songMeta.repeat) > 0){
            repeat = true
            repeatOff.classList.add('hidden')
            repeatOn.classList.remove('hidden')
            Amplitude.setRepeatSong(repeat)
          }
        }
      },
    });
  }
};

xhr.send();

// Video Play/Pause
let playPuase = document.querySelector(".amplitude-play-pause");
let video = document.querySelector("#video");
playPuase.addEventListener("click", function () {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

// Fetch and Play Function
function fetchVideoAndPlay(songMeta) {
  fetch(`${songMeta.url}`)
  .then(response => response.blob())
  .then(blob => {
    return video.play();
  })
}

// Repeat Buttons
let repeatOn = document.querySelector('#repeat-on')
let repeatOff = document.querySelector('#repeat-off')
var repeat = false
var repeatTime = 0

repeatOff.addEventListener('click', function(){
  repeatOff.classList.add('hidden')
  repeatOn.classList.remove('hidden')
  repeat = true
  Amplitude.setRepeatSong(repeat)
})

repeatOn.addEventListener('click', function(){
  repeatOff.classList.remove('hidden')
  repeatOn.classList.add('hidden')
  repeat = false
  Amplitude.setRepeatSong(repeat)
})
