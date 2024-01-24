import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

import { getStorage, ref, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-NhXH2ifin-LnmddIMtUpSDD5aguctrM",
  authDomain: "music-player-24d2a.firebaseapp.com",
  databaseURL:
    "https://music-player-24d2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "music-player-24d2a",
  storageBucket: "music-player-24d2a.appspot.com",
  messagingSenderId: "781505107231",
  appId: "1:781505107231:web:29290f258f64e42c154c2a",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
let imageDownloadUrl, currentlyPlaying = "hello testing", isPlaying = false, pauseChildIcon, pauseChildIconCopy; 

const musicLists = document.querySelector(".music-lists");
async function setMusicList() {
  const querySnapshot = await getDocs(collection(db, "music-detail"));
  querySnapshot.forEach(async (doc) => {
    let musicDownloadURL;
    const fileUrl = doc.data().fileUrl;
    const imageUrl = doc.data().thumbnailUrl;
    const musicFileRef = ref(storage, fileUrl);
    const imageFileRef = ref(storage, imageUrl);
    try {
      musicDownloadURL = await getDownloadURL(musicFileRef);
      imageDownloadUrl = await getDownloadURL(imageFileRef);
      console.log(musicDownloadURL);

    } catch (error) {
      console.error("Error getting download URL:", error);
    }
    const musicListItem = document.createElement("div");
    musicListItem.classList.add("music-list");
    
    //Audio element
    const audio = document.createElement("audio");
    audio.classList.add("musicPlayer");
    // console.log(musicDownloadURL);
    audio.src = musicDownloadURL;
    audio.preload = "none";
    audio.controls = true;
    
    // Create the image element
    const imageElement = document.createElement("img");
    imageElement.src = `${imageDownloadUrl}`;
    imageElement.alt = "Image";
    
    // Create the music name paragraph
    const musicName = document.createElement("p");
    musicName.classList.add("music-name");
    musicName.textContent = doc.data().title;
    
    // Create the duration span
    const durationSpan = document.createElement("span");
    durationSpan.classList.add("duration");
    durationSpan.textContent = doc.data().duration;
    
    // Create the pause icon
    const pauseIcon = document.createElement("i");
    pauseIcon.classList.add("fa-solid", "fa-1x", "fa-play", "play-btn");

    // Append elements to the music list item container
    musicListItem.appendChild(audio);
    musicListItem.appendChild(imageElement);
    musicListItem.appendChild(musicName);
    musicListItem.appendChild(durationSpan);
    musicListItem.appendChild(pauseIcon);

    // Append the music list item container to the music list container
    musicLists.appendChild(musicListItem);
    pauseIcon.addEventListener("click", function(event) {
        const musicListItem = event.target.parentNode;
        const audioElement = musicListItem.children[0];
        pauseChildIcon = musicListItem.querySelector('.play-btn');
        // console.log("Before reassignment: " + currentlyPlaying);
        // console.log(audioElement);
        // if (isPlaying && currentlyPlaying != audioElement) {
        //   isPlaying = false;
        //   currentlyPlaying.pause();
        //   pauseChildIconCopy.classList.remove("fa-pause");
        //   pauseChildIconCopy.classList.add("fa-play");
        //   console.log("checking" + currentlyPlaying);
        // }
        if (audioElement.paused) {
          // console.log(audioElement);
            pauseChildIcon.classList.remove("fa-play");
            pauseChildIcon.classList.add("fa-pause");
            audioElement.play();
            isPlaying = true;
            currentlyPlaying = audioElement;
            pauseChildIconCopy = pauseChildIcon;
        }
        else {
            pauseChildIcon.classList.remove("fa-pause");
            pauseChildIcon.classList.add("fa-play");
            audioElement.pause();
            isPlaying = false;
            currentlyPlaying = null;
        }
        // console.log("After reassignment: " + currentlyPlaying);
    });
  });
}

// Call the asynchronous function
document.addEventListener("DOMContentLoaded", function() {
    // Your code here

    setMusicList();

  });
