console.log("Welcome to Spotify");

// Initialize variables
let songIndex = 0;
let audioElement = new Audio('Songs/1.mp3');
let masterPlay = document.getElementById("masterPlay");
let myProgressBar = document.getElementById("pg-bar");
let masterSongName = document.getElementById("masterSongName");
let gif = document.getElementById("gif");
const shuffleIcon = document.getElementById("shuffleIcon");
const heartIcon = document.getElementById("heartIcon");

// Initialize shuffle state
let isShuffle = false;

// Initialize favorite songs array
let favoriteSongs = [];

// Array of song objects
let songs = [
    { songName: "How You Like That", filePath: "Songs/1.mp3", coverPath: "Images/hylt.jpg" },
    { songName: "Kill This Love", filePath: "Songs/2.mp3", coverPath: "Images/ktl.jpeg" },
    { songName: "DDU-DU-DDU-DU", filePath: "Songs/3.mp3", coverPath: "Images/4d.jpg" },
    { songName: "Shut Down", filePath: "Songs/4.mp3", coverPath: "Images/shut-down.jpg" },
    { songName: "Pink Venom", filePath: "Songs/5.mp3", coverPath: "Images/pink-venom.jpg" },
    { songName: "Lovesick Girls", filePath: "Songs/6.mp3", coverPath: "Images/lovesick-girls.jpg" },
    { songName: "Solo", filePath: "Songs/7.mp3", coverPath: "Images/solo.jpg" },
    { songName: "On The Ground - Rosé", filePath: "Songs/8.mp3", coverPath: "Images/otg.jpg" },
    { songName: "Money - Lalisa", filePath: "Songs/9.mp3", coverPath: "Images/money.jpeg" },
    { songName: "Flower - Jisoo", filePath: "Songs/10.mp3", coverPath: "Images/flower.jpg" },
    { songName: "As If It's Your Last", filePath: "Songs/11.mp3", coverPath: "Images/aiiyl.jpg" },
    { songName: "Tally", filePath: "Songs/12.mp3", coverPath: "Images/tally.jpg" },
    { songName: "Playing With Fire", filePath: "Songs/13.mp3", coverPath: "Images/playing-fire.jpg" },
];

// Function to format time as MM:SS
const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Function to update the UI and playback
const updateUI = () => {
    masterSongName.innerText = songs[songIndex].songName;
    if (audioElement.src !== songs[songIndex].filePath) {
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
        audioElement.load(); // Ensure the metadata is loaded
    }
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    makeAllPlays();
    document.getElementById(songIndex).classList.remove('fa-play-circle');
    document.getElementById(songIndex).classList.add('fa-pause-circle');
    
    // Update heart icon color
    if (favoriteSongs.includes(songIndex)) {
        heartIcon.classList.remove('fa-regular', 'fa-heart');
        heartIcon.classList.add('fa-solid', 'fa-heart');
        heartIcon.style.color = 'red';
    } else {
        heartIcon.classList.remove('fa-solid', 'fa-heart');
        heartIcon.classList.add('fa-regular', 'fa-heart');
        heartIcon.style.color = 'white';
    }

    // Update media session metadata
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songs[songIndex].songName,
            artist: 'BLACKPINK',
            album: 'Best of BLACKPINK',
            artwork: [
                { src: songs[songIndex].coverPath, sizes: '96x96', type: 'image/jpeg' },
                { src: songs[songIndex].coverPath, sizes: '128x128', type: 'image/jpeg' },
                { src: songs[songIndex].coverPath, sizes: '192x192', type: 'image/jpeg' },
                { src: songs[songIndex].coverPath, sizes: '256x256', type: 'image/jpeg' },
                { src: songs[songIndex].coverPath, sizes: '384x384', type: 'image/jpeg' },
                { src: songs[songIndex].coverPath, sizes: '512x512', type: 'image/jpeg' }
            ]
        });
    }
};

// Function to reset all song item icons to play
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    });
};

// Helper function to toggle play/pause
const togglePlayPause = (play) => {
    if (play) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
    makeAllPlays();
    document.getElementById(songIndex).classList.toggle('fa-play-circle', !play);
    document.getElementById(songIndex).classList.toggle('fa-pause-circle', play);
};

// Event listener for master play button
masterPlay.addEventListener('click', () => {
    togglePlayPause(audioElement.paused);
});

// Update progress bar and time display as the song plays
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    // Update current time display
    document.getElementById('current-time').innerText = formatTime(audioElement.currentTime);
});

// Update current time when progress bar is adjusted
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Event listener for song item play/pause
Array.from(document.getElementsByClassName("songItemPlay")).forEach((element) => {
    element.addEventListener('click', (e) => {
        const id = parseInt(e.target.id);
        if (songIndex === id) {
            togglePlayPause(audioElement.paused);
        } else {
            songIndex = id;
            updateUI();
        }
    });
});

// Function to play next song (handles shuffle)
const playNextSong = () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    }
    updateUI();
};

// Play next song when the current song ends
audioElement.addEventListener('ended', playNextSong);

// Event listener for next button
document.getElementById("next").addEventListener('click', () => {
    playNextSong(); // Use the playNextSong function
});

// Event listener for previous button
document.getElementById("previous").addEventListener('click', () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex = (songIndex <= 0) ? songs.length - 1 : songIndex - 1;
    }
    updateUI();
});

// Event listener for shuffle icon
shuffleIcon.addEventListener('click', () => {
    isShuffle = !isShuffle;
    
    // Toggle the active class on the shuffle icon
    if (isShuffle) {
        shuffleIcon.classList.add('active'); // Add class to show shuffle is active
    } else {
        shuffleIcon.classList.remove('active'); // Remove class to show shuffle is not active
    }
    
    console.log("Shuffle toggled:", isShuffle);
});

// Event listener for heart icon
heartIcon.addEventListener('click', () => {
    if (favoriteSongs.includes(songIndex)) {
        // Remove from favorites
        favoriteSongs = favoriteSongs.filter(index => index !== songIndex);
        heartIcon.classList.remove('fa-solid', 'fa-heart');
        heartIcon.classList.add('fa-regular', 'fa-heart');
        heartIcon.style.color = 'white';
    } else {
        // Add to favorites
        favoriteSongs.push(songIndex);
        heartIcon.classList.remove('fa-regular', 'fa-heart');
        heartIcon.classList.add('fa-solid', 'fa-heart');
        heartIcon.style.color = 'red';
    }
});

// Update duration when metadata is loaded
audioElement.addEventListener('loadedmetadata', () => {
    document.getElementById('total-duration').innerText = formatTime(audioElement.duration);
});

// Media Session API Setup
if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: songs[songIndex].songName,
        artist: 'BLACKPINK',
        album: 'Best of BLACKPINK',
        artwork: [
            { src: songs[songIndex].coverPath, sizes: '96x96', type: 'image/jpeg' },
            { src: songs[songIndex].coverPath, sizes: '128x128', type: 'image/jpeg' },
            { src: songs[songIndex].coverPath, sizes: '192x192', type: 'image/jpeg' },
            { src: songs[songIndex].coverPath, sizes: '256x256', type: 'image/jpeg' },
            { src: songs[songIndex].coverPath, sizes: '384x384', type: 'image/jpeg' },
            { src: songs[songIndex].coverPath, sizes: '512x512', type: 'image/jpeg' }
        ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
        if (audioElement.paused) {
            togglePlayPause(true);
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        if (!audioElement.paused) {
            togglePlayPause(false);
        }
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        document.getElementById("previous").click();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        document.getElementById("next").click();
    });
}
